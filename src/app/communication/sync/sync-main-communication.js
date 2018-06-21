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

import messages from '../messages'
import type { SyncReceiver } from './sync'
import type { SyncMainCommunication } from './sync-communication'
import type { LogCaches } from '../../bug-reporting/environment/environment-collector'

class SyncReceiverMainCommunication implements SyncMainCommunication {
  _syncReceiver: SyncReceiver

  constructor (syncReceiver: SyncReceiver) {
    this._syncReceiver = syncReceiver
  }

  onGetSessionId (callback: () => string): void {
    this._on(messages.GET_SESSION_ID, callback)
  }

  onGetSerializedCaches (callback: () => LogCaches): void {
    this._on(messages.GET_SERIALIZED_CACHES, callback)
  }

  _on (channel: string, callback: () => mixed) {
    this._syncReceiver.on(channel, callback)
  }
}

export default SyncReceiverMainCommunication
