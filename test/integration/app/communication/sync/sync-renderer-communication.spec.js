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

import { beforeEach, describe, expect, it } from '../../../../helpers/dependencies'
import SyncSenderRendererCommunication from '../../../../../src/app/communication/sync/sync-renderer-communication'
import messages from '../../../../../src/app/communication/messages'
import type { SyncReceiver, SyncSender } from '../../../../../src/app/communication/sync/sync'
import SyncReceiverMainCommunication from '../../../../../src/app/communication/sync/sync-main-communication'
import type { SerializedLogCaches } from '../../../../../src/app/logging/log-cache-bundle'
import { CallbackRecorder } from '../../../../helpers/utils'

class MockSyncReceiver implements SyncReceiver {
  _subscribers: { [string]: (data?: mixed) => mixed } = new Map()

  on (channel: string, callback: () => mixed): void {
    this._subscribers[channel] = callback
  }

  invoke (channel: string, data?: mixed): mixed {
    const subscriber = this._subscribers[channel]
    if (subscriber == null) {
      return
    }
    return subscriber(data)
  }
}

class MockSyncSender implements SyncSender {
  _mockReceiver: MockSyncReceiver

  constructor (mockReceiver: MockSyncReceiver) {
    this._mockReceiver = mockReceiver
  }

  send (channel: string, data?: any): mixed {
    return this._mockReceiver.invoke(channel, data)
  }
}

describe('SyncSenderRendererCommunication', () => {
  let receiver: MockSyncReceiver
  let sender: MockSyncSender

  beforeEach(() => {
    receiver = new MockSyncReceiver()
    sender = new MockSyncSender(receiver)
  })

  describe('.getSessionId', () => {
    it('gets value from listener', () => {
      const mainCommunication = new SyncReceiverMainCommunication(receiver)
      const rendererCommunication = new SyncSenderRendererCommunication(sender)

      mainCommunication.onGetSessionId(() => 'mock id')
      expect(rendererCommunication.getSessionId()).to.eql('mock id')
    })

    it('returns null when listener returns non-string', () => {
      const rendererCommunication = new SyncSenderRendererCommunication(sender)

      receiver.on(messages.GET_SESSION_ID, () => 123)
      expect(rendererCommunication.getSessionId()).to.be.null
    })
  })

  describe('.getSerializedCaches', () => {
    it('gets value from listener', () => {
      const mainCommunication = new SyncReceiverMainCommunication(receiver)
      const rendererCommunication = new SyncSenderRendererCommunication(sender)

      const mockLogs: SerializedLogCaches = {
        backend: {info: 'backend info', error: 'backend error'},
        frontend: {info: 'frontend info', error: 'frontend error'},
        mysterium_process: {info: 'mysterium info', error: 'mysterium error'}
      }
      mainCommunication.onGetSerializedCaches(() => mockLogs)
      expect(rendererCommunication.getSerializedCaches()).to.eql(mockLogs)
    })

    it('returns empty logs when listener returns null', () => {
      const rendererCommunication = new SyncSenderRendererCommunication(sender)

      receiver.on(messages.GET_SERIALIZED_CACHES, () => null)
      expect(rendererCommunication.getSerializedCaches()).to.eql(null)
    })
  })

  describe('.sendLog', () => {
    it('sends message to bus', () => {
      const mainCommunication = new SyncReceiverMainCommunication(receiver)
      const rendererCommunication = new SyncSenderRendererCommunication(sender)
      const recorder = new CallbackRecorder()

      mainCommunication.onLog(recorder.getCallback())
      const log = { level: 'info', data: 'Testing renderer log' }
      rendererCommunication.sendLog(log)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eq(log)
    })
  })
})
