// @flow
import {ipcMain} from 'electron'

import type { Ipc } from './ipc'
import Window from '../window'

class IpcMain implements Ipc {
  _window: any

  constructor (window: Window) {
    this._window = window
  }

  send (channel: string, data?: mixed) {
    this._window.send(channel, data)
  }

  on (channel: string, callback: Function) {
    ipcMain.on(channel, callback)
  }
}

export default IpcMain
