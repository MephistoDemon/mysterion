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
import MainMessageBusCommunication from '../../../../src/app/communication/main-message-bus-communication'
import type { MessageBus } from '../../../../src/app/communication/messageBus'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import { CallbackRecorder } from '../../../helpers/utils'
import type { MainCommunication } from '../../../../src/app/communication/main-communication'
import ConnectionStatusEnum from '../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'

class DirectMessageBus implements MessageBus {
  _subscribers: { [string]: (data?: mixed) => void } = new Map()

  send (channel: string, data?: mixed): void {
    if (this._subscribers[channel]) {
      this._subscribers[channel](data)
    }
  }

  on (channel: string, callback: (data?: mixed) => void): void {
    this._subscribers[channel] = callback
  }
}

describe('RendererCommunication', () => {
  let messageBus: MessageBus
  let rendererCommunication: RendererCommunication
  let mainCommunication: MainCommunication
  let recorder: CallbackRecorder

  beforeEach(() => {
    messageBus = new DirectMessageBus()
    rendererCommunication = new RendererCommunication(messageBus)
    mainCommunication = new MainMessageBusCommunication(messageBus)
    recorder = new CallbackRecorder()
  })

  describe('sendRendererBooted', () => {
    it('sends message through message bus', () => {
      mainCommunication.onRendererBooted(recorder.getCallback())
      rendererCommunication.sendRendererBooted()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendConnectionStatusChange', () => {
    it('sends message through message bus', () => {
      mainCommunication.onConnectionStatusChange(recorder.getCallback())
      const statusDto = {
        oldStatus: ConnectionStatusEnum.CONNECTED,
        newStatus: ConnectionStatusEnum.DISCONNECTING
      }
      rendererCommunication.sendConnectionStatusChange(statusDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(statusDto)
    })
  })

  describe('sendCurrentIdentityChange ', () => {
    it('sends message through message bus', () => {
      mainCommunication.onCurrentIdentityChange(recorder.getCallback())
      const identityDto = { id: 'test id' }
      rendererCommunication.sendCurrentIdentityChange(identityDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(identityDto)
    })
  })

  describe('sendProposalUpdateRequest', () => {
    it('sends message through message bus', () => {
      mainCommunication.onProposalUpdateRequest(recorder.getCallback())
      rendererCommunication.sendProposalUpdateRequest()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendTermsAnswered', () => {
    it('sends message through message bus', () => {
      mainCommunication.onTermsAnswered(recorder.getCallback())
      const answeredDto = { isAccepted: true }
      rendererCommunication.sendTermsAnswered(answeredDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(answeredDto)
    })
  })

  describe('sendUserSettingsRequest', () => {
    it('sends message through message bus', () => {
      mainCommunication.onUserSettingsRequest(recorder.getCallback())
      rendererCommunication.sendUserSettingsRequest()
      expect(recorder.invoked).to.be.true
    })
  })

  describe('sendUserSettingsUpdate', () => {
    it('sends message through message bus', () => {
      mainCommunication.onUserSettingsUpdate(recorder.getCallback())
      const settingsDto = { showDisconnectNotifications: true }
      rendererCommunication.sendUserSettingsUpdate(settingsDto)
      expect(recorder.invoked).to.be.true
      expect(recorder.argument).to.eql(settingsDto)
    })
  })
})
