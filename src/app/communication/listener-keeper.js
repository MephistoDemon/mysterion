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

// Listener is used for registering to channel events.
// It has different signature from MessageBusCallback.
import type { MessageBusCallback } from './message-bus'

type Listener = (event: Object, ...args: Array<any>) => void

class ListenerKeeper {
  // _channelListeners store callback listeners for each channel
  // This is needed on .removeCallback, because Listener and Callback are different objects.
  _channelListeners: Map<string, Map<MessageBusCallback, Listener>> = new Map()

  createListener (channel: string, callback: MessageBusCallback): Listener {
    if (this._hasListener(channel, callback)) {
      throw new Error('Callback being subscribed is already subscribed')
    }

    const listener = this._buildListener(callback)
    const listeners = this._getOrInitializeChannelListeners(channel)
    listeners.set(callback, listener)
    return listener
  }

  removeListener (channel: string, callback: MessageBusCallback): Listener {
    let listener
    try {
      listener = this._getListener(channel, callback)
    } catch (err) {
      throw new Error(`Removing callback for '${channel}' message in renderer failed: ${err.message}`)
    }
    this._removeListenerFromMap(channel, callback)
    return listener
  }

  _hasListener (channel: string, callback: MessageBusCallback): boolean {
    const listeners = this._getChannelListeners(channel)
    if (!listeners) {
      return false
    }
    return listeners.has(callback)
  }

  _buildListener (callback: MessageBusCallback): Listener {
    return (event, data) => {
      callback(data)
    }
  }

  _getOrInitializeChannelListeners (channel: string): Map<MessageBusCallback, Listener> {
    let listeners = this._getChannelListeners(channel)
    if (!listeners) {
      listeners = new Map()
      this._channelListeners.set(channel, listeners)
    }
    return listeners
  }

  _getListener (channel: string, callback: MessageBusCallback): Listener {
    const listeners = this._getChannelListeners(channel)
    if (!listeners) {
      throw new Error(`No listeners found for "${channel}" channel`)
    }
    const listener = listeners.get(callback)
    if (!listener) {
      throw new Error(`No listener found for callback on ${channel} channel`)
    }
    return listener
  }

  _removeListenerFromMap (channel: string, callback: MessageBusCallback) {
    const listeners = this._getChannelListeners(channel)
    if (!listeners) {
      throw new Error('No listener found')
    }
    listeners.delete(callback)
  }

  _getChannelListeners (channel: string): ?Map<MessageBusCallback, Listener> {
    return this._channelListeners.get(channel)
  }
}

export default ListenerKeeper
