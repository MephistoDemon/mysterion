/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import {ipcMain} from 'electron'

import type { MessageBus, MessageBusCallback } from './message-bus'

type Sender = (channel: string, data?: mixed) => void

class MainMessageBus implements MessageBus {
  _send: Sender
  _captureException: (Error) => void

  constructor (send: Sender, captureException: (Error) => void) {
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

  on (channel: string, callback: MessageBusCallback): void {
    ipcMain.on(channel, (event, data) => {
      callback(data)
    })
  }

  removeCallback (channel: string, callback: MessageBusCallback): void {
    // TODO: implement
    throw new Error('Not implemented')
  }
}

export default MainMessageBus
