// @flow
import {ipcMain} from 'electron'

import type { MessageBus } from './messageBus'

type Sender = (channel: string, data?: mixed) => void

class MainMessageBus implements MessageBus {
  _send: Sender
  _captureException: Function

  constructor (send: Sender, captureException: Function) {
    this._send = send
    this._captureException = captureException
  }

  send (channel: string, data?: mixed): void {
    try {
      this._send(channel, data)
    } catch (err) {
      this._captureException(err)
    }
  }

  on (channel: string, callback: Function): void {
    ipcMain.on(channel, (event, data) => {
      callback(data)
    })
  }
}

export default MainMessageBus
