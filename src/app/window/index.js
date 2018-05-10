// @flow

// TODO: find better name - AppWindow?
import {BrowserWindow} from 'electron'

class Window {
  window: BrowserWindow
  url: string

  constructor (browserWindow: BrowserWindow, url: string) {
    this.url = url
    this.window = browserWindow
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

  resize (size: Size) {
    this.window.setSize(size.width, size.height)
  }

  toggleDevTools () {
    this.window.show()
    this.window.toggleDevTools()
  }
}

type Size = {
  width: number,
  height: number
}

export default Window
