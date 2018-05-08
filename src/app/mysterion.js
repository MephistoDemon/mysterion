import {app} from 'electron'
import Window from './window'
import communication from './communication/index'
import trayFactory from '../main/tray/factory'
import {logLevel as processLogLevel} from '../libraries/mysterium-client/index'
import bugReporter from './bugReporting/bug-reporting'
import messages from './messages'
import MainCommunication from './communication/main-communication'
import MainMessageBus from './communication/mainMessageBus'
import {onFirstEvent} from './communication/utils'
import path from 'path'

class Mysterion {
  constructor ({config, terms, installer, monitoring, process, proposalFetcher}) {
    Object.assign(this, {config, terms, installer, monitoring, process, proposalFetcher})
  }

  run () {
    // fired when app has been launched
    app.on('ready', async () => {
      await this.bootstrap()
      this.buildTray()
    })
    // fired when all windows are closed
    app.on('window-all-closed', () => this.onWindowsClosed())
    // fired just before quitting, this should quit
    app.on('will-quit', () => this.onWillQuit())
    // fired when app activated
    app.on('activate', () => {
      if (!this.window.exists()) {
        return this.bootstrap()
      }
      this.window.show()
    })
    app.on('before-quit', () => {
      this.window.willQuitApp = true
    })
  }

  async bootstrap () {
    let termsAccepted
    try {
      this.terms.load()
      termsAccepted = this.terms.isAccepted()
    } catch (e) {
      termsAccepted = false
      bugReporter.main.captureException(e)
    }

    this.window = new Window(
      termsAccepted
        ? this.config.windows.app
        : this.config.windows.terms,
      this.config.windows.url
    )

    try {
      this.window.open()
    } catch (e) {
      console.error(e)
      bugReporter.main.captureException(e)
      throw new Error('Failed to open window.')
    }

    const send = this.window.send.bind(this.window)
    this.messageBus = new MainMessageBus(send)
    this.communication = new MainCommunication(this.messageBus)

    try {
      await onFirstEvent(this.communication.onRendererLoaded.bind(this.communication))
    } catch (e) {
      console.error(e)
      bugReporter.main.captureException(e)
      // TODO: add an error wrapper method
      throw new Error('Failed to load app.')
    }

    // make sure terms are up to date and accepted
    // declining terms will quit the app
    if (!termsAccepted) {
      try {
        const accepted = await this.acceptTerms()
        if (!accepted) {
          console.log('Terms were refused. Quitting.')
          app.quit()
          return
        }
      } catch (e) {
        bugReporter.main.captureException(e)
        return this.sendErrorToRenderer(e.message)
      }
    }

    // checks if daemon is installed or daemon file is expired
    // if the installation fails, it sends a message to the renderer window
    if (this.installer.needsInstallation()) {
      try {
        await this.installer.install()
      } catch (e) {
        bugReporter.main.captureException(e)
        console.error(e)
        return this.sendErrorToRenderer(messages.daemonInstallationError)
      }
    }
    // if all is good, let's boot up the client
    // and start monitoring it
    await this.startProcess()
  }

  onWindowsClosed () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  async onWillQuit () {
    this.monitoring.stop()
    this.proposalFetcher.stop()

    try {
      await this.process.stop()
    } catch (e) {
      console.error('Failed to stop mysterium_client process')
      bugReporter.main.captureException(e)
    }
  }

  async acceptTerms () {
    this.messageBus.send(communication.TERMS_REQUESTED, {
      content: this.terms.getContent()
    })

    const termsAnswer = await onFirstEvent((callback) => {
      this.messageBus.on(communication.TERMS_ANSWERED, callback)
    })
    if (!termsAnswer) {
      return false
    }

    this.messageBus.send(communication.TERMS_ACCEPTED)

    try {
      this.terms.accept()
    } catch (e) {
      const error = new Error(messages.termsAcceptError)
      error.original = e
      console.error(error)
      throw error
    }

    this.window.resize(this.config.windows.app)

    return true
  }

  async startProcess () {
    const updateRendererWithHealth = () => {
      try {
        this.messageBus.send(communication.HEALTHCHECK, this.monitoring.isRunning())
      } catch (e) {
        bugReporter.main.captureException(e)
        return
      }

      setTimeout(() => updateRendererWithHealth(), 1500)
    }
    const cacheLogs = (level, data) => {
      this.communication.sendMysteriumClientLog({level, data})
      bugReporter.pushToLogCache(level, data)
    }

    this.process.start()
    this.monitoring.start()
    this.process.onLog(processLogLevel.LOG, (data) => cacheLogs(processLogLevel.LOG, data))
    this.process.onLog(processLogLevel.ERROR, (data) => cacheLogs(processLogLevel.ERROR, data))
    this.monitoring.onProcessReady(() => {
      updateRendererWithHealth()
      this.startApp()
    })

    this.communication.onCurrentIdentityChange((identity) => {
      bugReporter.setUser(identity)
    })
  }

  /**
   * notifies the renderer that we're good to go and sets up the system tray
   */
  startApp () {
    this.proposalFetcher.subscribe((proposals) => this.communication.sendProposals(proposals))
    this.proposalFetcher.start()

    this.communication.onProposalUpdateRequest(async () => {
      this.communication.sendProposals(await this.proposalFetcher.fetch())
    })

    this.messageBus.send(communication.APP_START)
  }

  sendErrorToRenderer (error, hint = '', fatal = true) {
    this.window.send(communication.APP_ERROR, {message: error, hint: hint, fatal: fatal})
  }

  buildTray () {
    trayFactory(
      this.communication,
      this.proposalFetcher,
      this.window,
      path.join(this.config.staticDirectoryPath, 'icons')
    )
  }
}

export default Mysterion
