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

import type { MessageBus, MessageBusCallback } from '../../src/app/communication/messageBus'

class SubscribableMessageBus implements MessageBus {
  _callbacks: { [string]: ?MessageBusCallback } = {}
  _callbacksCount = 0

  send (channel: string, data?: mixed): void {
  }

  on (channel: string, callback: MessageBusCallback): void {
    this._callbacks[channel] = callback
    this._callbacksCount++
  }

  removeCallback (channel: string, callback: MessageBusCallback): void {
    if (this._callbacks[channel] !== callback) {
      throw new Error('Callback being removed was not found')
    }
    delete this._callbacks[channel]
    this._callbacksCount--
  }

  triggerOn (channel: string, data?: mixed): void {
    const callback = this._callbacks[channel]
    if (!callback) {
      return
    }
    callback(data)
  }

  noRemainingCallbacks (): boolean {
    return this._callbacksCount === 0
  }
}

export default SubscribableMessageBus
