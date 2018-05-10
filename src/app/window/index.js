import {BrowserWindow} from 'electron'

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

  toggleDevTools () {
    this.window.show()
    this.window.toggleDevTools()
  }
}

export default Window
