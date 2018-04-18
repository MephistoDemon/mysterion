import {BrowserWindow} from 'electron'
import bugReporter from './bugReporting/bug-reporting'
import MainMessageBus from './communication/mainMessageBus'
import {waitForFirstEvent} from './communication/utils'

// TODO: find better name - AppWindow?
class Window {
  constructor ({width, height}, url) {
    let options = {
      height: height,
      width: width,
      resizable: false,
      show: false
    }
    this.url = url
    this.window = new BrowserWindow(options)
  }

  exists () {
    return !!this.window
  }

  show () {
    this.window.show()
  }

  hide () {
    this.window.hide()
  }

  /**
   * @returns {Window}
   */
  open () {
    this.window.loadURL(this.url)
    this.window.once('ready-to-show', () => {
      this.window.show()
    })
    this.window.on('closed', () => {
      this.window = null
    })
    this.window.on('before-quit', () => {
      this.willQuitApp = true
    })
    this.window.on('close', (e) => {
      if (!this.willQuitApp) {
        /* the user only tried to close the window */
        e.preventDefault()
        this.hide()
      }
    })
  }

  resize ({width, height}) {
    this.window.setSize(width, height)
  }

  /**
   * Sends message to the renderer
   *
   * @param event
   * @param data
   */
  send (event, data) {
    if (!this.window) {
      const message = `Failed to send message ${event} to renderer, because window is already closed`
      // TODO: use captureMessage instead
      bugReporter.main.captureException(new Error(message))
      return
    }
    this.window.webContents.send(event, data)
  }

  /**
   * Waits for IPC communication event
   *
   * @param event
   * @returns {Promise<void>}
   */
  // TODO: remove once it's not used anymore
  async wait (event) {
    const messageBus = new MainMessageBus(this.send)
    const subscriber = (callback) => messageBus.on(event, callback)
    await waitForFirstEvent(subscriber)
  }

  toggleDevTools () {
    this.window.show()
    this.window.toggleDevTools()
  }
}

export default Window
