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
import {ipcRenderer} from 'electron'
import type { MessageBus, MessageBusCallback } from './message-bus'

// Listener is used for registering to channel events.
// It has different signature from MessageBusCallback.
type Listener = (event: Object, ...args: Array<any>) => void

class RendererMessageBus implements MessageBus {
  // _channelListeners store callback listeners for each channel
  // This is needed on .removeCallback, because Listener and Callback are different objects.
  _channelListeners: Map<string, Map<MessageBusCallback, Listener>> = new Map()

  send (channel: string, data?: mixed): void {
    ipcRenderer.send(channel, data)
  }

  on (channel: string, callback: MessageBusCallback): void {
    const listeners = this._getListeners(channel)

    if (listeners.has(callback)) {
      throw new Error('Callback being subscribed to RendererMessageBus is already subscribed')
    }
    const listener = this._buildListener(callback)
    listeners.set(callback, listener)
    this._registerListener(channel, listener)
  }

  removeCallback (channel: string, callback: MessageBusCallback): void {
    const errorMessage = `Removing callback for '${channel}' message in renderer failed - callback was not found`
    const listeners = this._channelListeners.get(channel)
    if (!listeners) {
      throw new Error(errorMessage)
    }
    const listener = listeners.get(callback)
    if (!listener) {
      throw new Error(errorMessage)
    }
    this._removeListener(channel, listener)
    listeners.delete(callback)
  }

  _getListeners (channel: string): Map<MessageBusCallback, Listener> {
    let listeners = this._channelListeners.get(channel)
    if (!listeners) {
      listeners = new Map()
      this._channelListeners.set(channel, listeners)
    }
    return listeners
  }

  _buildListener (callback: MessageBusCallback): Listener {
    return (event, data) => {
      callback(data)
    }
  }

  _registerListener (channel: string, listener: Listener) {
    ipcRenderer.on(channel, listener)
  }

  _removeListener (channel: string, listener: Listener) {
    ipcRenderer.removeListener(channel, listener)
  }
}

export default RendererMessageBus
