import path from 'path'
import Window from './window'
import Terms from './terms/index'
import TequilAPI from '../libraries/api/tequilapi'
import communication from './communication/index'
import {app, Menu, Tray} from 'electron'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'
import {Installer as MysteriumDaemonInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client/index'

function MysterionFactory (config, termsContent, termsVersion) {
  const tequilApi = new TequilAPI()
  return new Mysterion({
    config,
    terms: new Terms(config.userDataDirectory, termsContent, termsVersion),
    installer: new MysteriumDaemonInstaller(config),
    monitoring: new ProcessMonitoring(tequilApi),
    process: new MysteriumProcess(tequilApi)
  })
}

class Mysterion {
  constructor ({config, terms, installer, monitoring, process}) {
    Object.assign(this, {config, terms, installer, monitoring, process})
  }

  run () {
    // fired when app has been launched
    app.on('ready', () => this.onReady())
    // fired when all windows are closed
    app.on('window-all-closed', () => this.onWindowsClosed())
    // fired just before quitting, this should quit
    app.on('will-quit', () => this.onWillQuit())
    // fired when app activated
    app.on('activate', () => (this.onActivation()))
  }

  async onReady () {
    this.window = new Window(
      this.terms.accepted()
        ? this.config.windows.app
        : this.config.windows.terms,
      this.config.windows.url
    )

    try {
      await this.window.open().on(communication.RENDERER_LOADED)
    } catch (e) {
      // add an error wrapper method which will do this
      let err = new Error('Failed to load app.')
      err.original = e

      throw err
    }

    // make sure terms are up to date and accepted
    // declining terms will quit the app
    if (!this.terms.accepted()) {
      try {
        await this.acceptTermsOrQuit()
      } catch (e) {
        return this.sendErrorToRenderer(e.message)
      }
    }

    // checks if daemon is installed
    // if the installation fails, it sends a message to the renderer window
    if (!this.installer.processInstalled()) {
      try {
        await this.installer.install()
      } catch (e) {
        console.error(e)
        // throw new Error('Failed to install mysterium_client daemon. Please restart the app and grant permissions.')
        return this.sendErrorToRenderer(e.message)
      }
    }
    // if all is good, let's boot up the client
    // and start monitoring it
    await this.startProcess()

    this.startApp()
  }

  onWindowsClosed () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  }

  onActivation () {
    if (this.window === null) {
      this.onReady()
    }
  }

  async onWillQuit () {
    this.monitoring.stop()
    await this.process.stop()
  }

  async acceptTermsOrQuit () {
    this.window.send(communication.TERMS_REQUESTED, {
      content: this.terms.getContent(),
      version: this.terms.getVersion()
    })

    const termsAnswer = await this.window.on(communication.TERMS_ANSWERED)
    if (!termsAnswer.value) {
      console.log('Terms were refused. Quitting.')
      app.quit()
      return
    }

    this.window.send(communication.TERMS_ACCEPTED)

    try {
      this.terms.store()
    } catch (e) {
      console.error(e)
      throw new Error('Failed to make a local copy of terms and conditions. Please restart the app and try again.')
    }

    this.window.resize(this.config.windows.app)
  }

  async startProcess () {
    const updateRendererWithHealth = () => {
      try {
        this.window.send(communication.HEALTHCHECK, this.monitoring.isRunning())
      } catch (e) {
        // expecting last send calls to fail when window is closed
        return
      }

      setTimeout(() => updateRendererWithHealth(), 1500)
    }

    this.process.start()
    this.monitoring.start()
    this.monitoring.onProcessReady(() => {
      updateRendererWithHealth()
    })
  }

  /**
   * notifies the renderer that we're good to go and sets up the system tray
   */
  startApp () {
    this.window.send(communication.APP_START)
    this.buildTray()
  }

  sendErrorToRenderer (error, hint = '', fatal = true) {
    // TODO: send to sentry
    this.window.send(communication.APP_ERROR, {message: error, hint: hint, fatal: fatal})
  }

  buildTray () {
    let trayIconPath = path.join(__static, 'icons', 'tray.png')
    let tray = new Tray(trayIconPath)
    let template = []

    template.push({
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    })

    if (this.config.inDevMode) {
      template = [{
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => {
          this.window.toggleDevTools()
        }
      }, ...template]
    }

    tray.setToolTip('Mysterium')
    tray.setContextMenu(Menu.buildFromTemplate(template))
  }
}

export default MysterionFactory
