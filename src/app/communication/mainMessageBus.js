// @flow
import {ipcMain} from 'electron'

import type { MessageBus } from './messageBus'

type Sender = (channel: string, data?: mixed) => void

class MainMessageBus implements MessageBus {
  _send: Sender

  constructor (send: Sender) {
    this._send = send
  }

  send (channel: string, data?: mixed): void {
    this._send(channel, data)
  }

  on (channel: string, callback: Function): void {
    ipcMain.on(channel, (event, data) => {
      callback(data)
    })
  }
}

export default MainMessageBus
