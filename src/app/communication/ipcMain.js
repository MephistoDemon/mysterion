// @flow
import {ipcMain} from 'electron'

import type { Ipc } from './ipc'

type Sender = (channel: string, data?: mixed) => void

class IpcMain implements Ipc {
  _send: Sender

  constructor (send: Sender) {
    this._send = send
  }

  send (channel: string, data?: mixed): void {
    this._send(channel, data)
  }

  on (channel: string, callback: Function): void {
    ipcMain.on(channel, callback)
  }
}

export default IpcMain
