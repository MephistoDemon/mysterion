// @flow

// TODO: find better name - AppWindow?
import {BrowserWindow} from 'electron'
import type {RequestRewriter} from './interface'
import type {HeaderRule} from './requestHeaders'
import registerHeaderRules from './requestHeaders'

class Window implements RequestRewriter {
  browserWindow: BrowserWindow
  url: string
  willQuitApp: boolean

  constructor (browserWindow: BrowserWindow, url: string) {
    this.url = url
    this.browserWindow = browserWindow
  }

  registerRequestHeadersRule (rule: HeaderRule) {
    registerHeaderRules(this.browserWindow.webContents.session, rule)
  }

  exists () {
    return !!this.browserWindow
  }

  show () {
    this.browserWindow.show()
  }

  hide () {
    this.browserWindow.hide()
  }

  open () {
    this.browserWindow.loadURL(this.url)
    this.browserWindow.once('ready-to-show', () => {
      this.browserWindow.show()
    })
    this.browserWindow.on('closed', () => {
      this.browserWindow = null
    })
    this.browserWindow.on('before-quit', () => {
      this.willQuitApp = true
    })
    this.browserWindow.on('close', (e) => {
      if (!this.willQuitApp) {
        /* the user only tried to close the window */
        e.preventDefault()
        this.hide()
      }
    })
  }

  resize (size: Size) {
    this.browserWindow.setSize(size.width, size.height)
  }

  toggleDevTools () {
    this.browserWindow.show()
    this.browserWindow.toggleDevTools()
  }
}

type Size = {
  width: number,
  height: number
}

export default Window
