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

import type { Listener } from '../../src/app/communication/ipc-message-bus'
import type { Ipc } from '../../src/app/communication/ipc/ipc'

class MockIpc implements Ipc {
  addedSubscribers: Array<ChannelListener> = []
  removedSubscribers: Array<ChannelListener> = []

  send (channel: string, data?: mixed): void {
  }

  on (channel: string, listener: Listener): void {
    this.addedSubscribers.push({channel, listener})
  }

  removeCallback (channel: string, listener: Listener): void {
    this.removedSubscribers.push({channel, listener})
  }
}

type ChannelListener = {
  channel: string,
  listener: Listener
}

export default MockIpc
