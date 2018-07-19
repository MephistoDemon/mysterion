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

import { beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import IpcMessageBus from '../../../../src/app/communication/ipc-message-bus'
import { CallbackRecorder, captureError } from '../../../helpers/utils'
import MockIpc from '../../../helpers/mock-ipc'

describe('IpcMessageBus', () => {
  let messageBus
  let mockIpc
  let emptyCallback

  beforeEach(() => {
    mockIpc = new MockIpc()
    messageBus = new IpcMessageBus(mockIpc)
    emptyCallback = () => {}
  })

  describe('.on', () => {
    it('adds listener for callback', () => {
      const recorder = new CallbackRecorder()

      messageBus.on('channel', recorder.getCallback())
      expect(mockIpc.addedSubscribers.length).to.eql(1)
      const subscriber = mockIpc.addedSubscribers[0]
      expect(subscriber.channel).to.eql('channel')

      subscriber.listener({}, 'data')
      expect(recorder.invoked).to.be.true
      expect(recorder.arguments).to.eql(['data'])
    })

    it('throws error when subscribing same callback to the same channel twice', () => {
      const create = () => messageBus.on('channel', emptyCallback)
      create()
      const err = captureError(create)
      if (!err) {
        throw new Error('Expected error to be thrown')
      }
      expect(err).to.be.an('error')
      expect(err.message).to.eql('Callback being subscribed is already subscribed')
    })

    it('allows subscribing same callback to different channels', () => {
      messageBus.on('channel 1', emptyCallback)
      messageBus.on('channel 2', emptyCallback)
    })
  })

  describe('.removeCallback', () => {
    it('removes listener', () => {
      messageBus.on('channel', emptyCallback)
      messageBus.removeCallback('channel', emptyCallback)

      expect(mockIpc.addedSubscribers.length).to.eql(1)
      const addedSubscriber = mockIpc.addedSubscribers[0]

      expect(mockIpc.removedSubscribers.length).to.eql(1)
      const removedSubscriber = mockIpc.removedSubscribers[0]
      expect(removedSubscriber.channel).to.eql('channel')
      expect(removedSubscriber.listener).to.eql(addedSubscriber.listener)
    })

    it('allows re-subscribing same callback again', () => {
      messageBus.on('channel', emptyCallback)
      messageBus.removeCallback('channel', emptyCallback)

      messageBus.on('channel', emptyCallback)
    })

    it('throws error when invoke twice with same callback', () => {
      messageBus.on('channel', emptyCallback)
      const remove = () => messageBus.removeCallback('channel', emptyCallback)
      remove()
      const err = captureError(remove)
      if (!err) {
        throw new Error('Expected error to be thrown')
      }
      expect(err).to.be.an('error')
      expect(err.message).to.eql(
        "Removing callback for 'channel' message in renderer failed: No listener found for callback on channel channel"
      )
    })
  })
})
