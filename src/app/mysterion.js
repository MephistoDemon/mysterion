import {app} from 'electron'
import communication from './communication/index'
import trayFactory from '../main/tray/factory'
import {logLevel as processLogLevel} from '../libraries/mysterium-client/index'
import messages from './messages'
import MainCommunication from './communication/main-communication'
import MainMessageBus from './communication/mainMessageBus'
import {onFirstEvent} from './communication/utils'
import path from 'path'

class Mysterion {
  constructor ({browserWindowFactory, windowFactory, config, terms, installer, monitoring, process, proposalFetcher, bugReporter, plugins}) {
    Object.assign(this, {browserWindowFactory, windowFactory, config, terms, installer, monitoring, process, proposalFetcher, bugReporter, plugins})
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
      this.bugReporter.captureException(e)
    }

    let browserWindow
    try {
      browserWindow = this.browserWindowFactory()
      this.window = this.windowFactory()
      if (termsAccepted) {
        this.window.resize(this.config.windows.app)
      } else {
        this.window.resize(this.config.windows.terms)
      }
      this.window.open()
    } catch (e) {
      console.error(e)
      this.bugReporter.captureException(e)
      throw new Error('Failed to open window.')
    }

    try {
      this.plugins.get('feedbackForm').install(browserWindow)
    } catch (err) {
      console.error('Sentry feedback form installation failed. ', err.stack)
      this.bugReporter.captureException(err)
    }

    this.messageBus = new MainMessageBus(browserWindow.webContents.send, this.bugReporter.captureException)
    this.communication = new MainCommunication(this.messageBus)

    try {
      await onFirstEvent(this.communication.onRendererLoaded.bind(this.communication))
    } catch (e) {
      console.error(e)
      this.bugReporter.captureException(e)
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
        this.bugReporter.captureException(e)
        return communication.sendErrorToRenderer(e.message)
      }
    }

    // checks if daemon is installed or daemon file is expired
    // if the installation fails, it sends a message to the renderer window
    if (this.installer.needsInstallation()) {
      try {
        await this.installer.install()
      } catch (e) {
        this.bugReporter.captureException(e)
        console.error(e)
        return communication.sendErrorToRenderer(messages.daemonInstallationError)
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
      this.bugReporter.captureException(e)
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
        this.bugReporter.captureException(e)
        return
      }

      setTimeout(() => updateRendererWithHealth(), 1500)
    }
    const cacheLogs = (level, data) => {
      this.communication.sendMysteriumClientLog({level, data})
      this.bugReporter.pushToLogCache(level, data)
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
      this.bugReporter.setUser(identity)
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
