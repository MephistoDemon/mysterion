import {BrowserWindow, ipcMain} from 'electron'

function Message (sender, value) {
  return {
    sender: sender,
    value: value
  }
}

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
    this.window.on('before-quit', () => { this.willQuitApp = true })
    this.window.on('close', (e) => {
      if (!this.willQuitApp) {
        /* the user only tried to close the window */
        e.preventDefault()
        this.hide()
      }
    })

    return this
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
    this.window.webContents.send(event, data)
  }

  /**
   * Ipc communication event
   *
   * @param event
   * @param timeoutInterval
   * @returns {Promise<any>}
   */
  on (event, timeoutInterval = 0) {
    return new Promise((resolve, reject) => {
      let timeout
      if (timeoutInterval > 0) {
        timeout = setTimeout(() => {
          reject(new Error('Failed to load the window in time.'))
        }, timeoutInterval)
      }

      ipcMain.on(event, async (event, value) => {
        resolve(Message(event.sender, value))
        clearInterval(timeout)
      })
    })
  }

  toggleDevTools () {
    this.window.show()
    this.window.toggleDevTools()
  }
}

export default Window
