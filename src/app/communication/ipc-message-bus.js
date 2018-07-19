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

// EventListener is used for registering to channel events.
// It has different signature from MessageBusCallback.
import type { MessageBus, MessageBusCallback } from './message-bus'
import type { Ipc } from './ipc/ipc'

type EventListener = (event: Object, ...args: Array<any>) => void

class IpcMessageBus implements MessageBus {
  // _channelListeners store callback listeners for each channel
  // This is needed on .removeCallback, because EventListener and MessageBusCallback are different objects.
  _channelListeners: Map<string, Map<MessageBusCallback, EventListener>> = new Map()
  _ipc: Ipc

  constructor (ipc: Ipc) {
    this._ipc = ipc
  }

  send (channel: string, data?: mixed): void {
    this._ipc.send(channel, data)
  }

  on (channel: string, callback: MessageBusCallback) {
    const listener = this._createListener(channel, callback)
    this._ipc.on(channel, listener)
  }

  removeCallback (channel: string, callback: MessageBusCallback) {
    const listener = this._removeListener(channel, callback)
    this._ipc.removeCallback(channel, listener)
  }

  _createListener (channel: string, callback: MessageBusCallback): EventListener {
    if (this._hasListener(channel, callback)) {
      throw new Error('Callback being subscribed is already subscribed')
    }

    const listener = this._buildListener(callback)
    const listeners = this._getOrInitializeListeners(channel)
    listeners.set(callback, listener)
    return listener
  }

  _hasListener (channel: string, callback: MessageBusCallback): boolean {
    const listeners = this._getOrInitializeListeners(channel)
    return listeners.has(callback)
  }

  _buildListener (callback: MessageBusCallback): EventListener {
    return (event, data) => {
      callback(data)
    }
  }

  _getOrInitializeListeners (channel: string): Map<MessageBusCallback, EventListener> {
    let listeners = this._channelListeners.get(channel)
    if (!listeners) {
      listeners = new Map()
      this._channelListeners.set(channel, listeners)
    }
    return listeners
  }

  _getListener (channel: string, callback: MessageBusCallback): EventListener {
    const listeners = this._getOrInitializeListeners(channel)
    const listener = listeners.get(callback)
    if (!listener) {
      throw new Error(`No listener found for callback on ${channel} channel`)
    }
    return listener
  }

  _removeListener (channel: string, callback: MessageBusCallback): EventListener {
    let listener
    try {
      listener = this._getListener(channel, callback)
    } catch (err) {
      throw new Error(`Removing callback for '${channel}' message in renderer failed: ${err.message}`)
    }

    const listeners = this._getOrInitializeListeners(channel)
    listeners.delete(callback)

    return listener
  }
}

export type { EventListener }
export default IpcMessageBus
