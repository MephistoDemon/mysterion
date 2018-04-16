// @flow
import {ipcMain} from 'electron'

import type { Ipc } from './ipc'
import Window from '../window'

class IpcMain implements Ipc {
  _window: any

  constructor (window: Window) {
    this._window = window
  }

  send (channel: string, data?: mixed): void {
    this._window.send(channel, data)
  }

  on (channel: string, callback: Function): void {
    ipcMain.on(channel, callback)
  }
}

export default IpcMain
