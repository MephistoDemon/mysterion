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

import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import messages from '../../../../src/app/communication/messages'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import {CallbackRecorder} from '../../../helpers/utils'
import {describe, beforeEach, it} from '../../../helpers/dependencies'

describe('RendererCommunication', () => {
  let fakeMessageBus
  let communication
  let callbackRecorder

  beforeEach(() => {
    fakeMessageBus = new FakeMessageBus()
    communication = new RendererCommunication(fakeMessageBus)
    callbackRecorder = new CallbackRecorder()
  })

  describe('sendConnectionStatusChange', () => {
    it('sends message to bus', () => {
      const data = { oldStatus: 'old', newStatus: 'new' }
      communication.sendConnectionStatusChange(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.CONNECTION_STATUS_CHANGED)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendCurrentIdentityChange', () => {
    it('sends message to bus', () => {
      const data = { id: '0xC001FACE00000123' }
      communication.sendCurrentIdentityChange(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.CURRENT_IDENTITY_CHANGED)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendProposalUpdateRequest', () => {
    it('sends message to bus', () => {
      communication.sendProposalUpdateRequest()

      expect(fakeMessageBus.lastChannel).to.eql(messages.PROPOSALS_UPDATE)
    })
  })

  describe('sendRendererBooted', () => {
    it('sends message to bus', () => {
      communication.sendRendererBooted()

      expect(fakeMessageBus.lastChannel).to.eql(messages.RENDERER_BOOTED)
    })
  })

  describe('sendTermsAnswered', () => {
    it('sends message to bus', () => {
      const data = { answer: true }
      communication.sendTermsAnswered(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.TERMS_ANSWERED)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendUserSettingsRequest', () => {
    it('sends message to bus', () => {
      communication.sendUserSettingsRequest()

      expect(fakeMessageBus.lastChannel).to.eql(messages.USER_SETTINGS_REQUEST)
    })
  })

  describe('sendUserSettingsUpdate', () => {
    it('sends message to bus', () => {
      const data = { showDisconnectNotifications: true }
      communication.sendUserSettingsUpdate(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.USER_SETTINGS_UPDATE)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('onConnectionRequest', () => {
    it('receives message from bus', () => {
      communication.onConnectionRequest(callbackRecorder.getCallback())

      const data = { providerId: '0x123' }
      fakeMessageBus.triggerOn(messages.CONNECTION_REQUEST, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onDisconnectionRequest', () => {
    it('receives message from bus', () => {
      communication.onDisconnectionRequest(callbackRecorder.getCallback())

      fakeMessageBus.triggerOn(messages.CONNECTION_CANCEL)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onProposalUpdate', () => {
    it('receives message from bus', () => {
      communication.onProposalUpdate(callbackRecorder.getCallback())

      const data = [{ id: 1 }]
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onTermsRequest', () => {
    it('receives message from bus', () => {
      communication.onTermsRequest(callbackRecorder.getCallback())

      const data = { content: 'Cool terms' }
      fakeMessageBus.triggerOn(messages.TERMS_REQUESTED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onTermsAccepted', () => {
    it('receives message from bus', () => {
      communication.onTermsAccepted(callbackRecorder.getCallback())

      fakeMessageBus.triggerOn(messages.TERMS_ACCEPTED)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onMysteriumClientIsReady', () => {
    it('receives message from bus', () => {
      communication.onMysteriumClientIsReady(callbackRecorder.getCallback())

      fakeMessageBus.triggerOn(messages.MYSTERIUM_CLIENT_READY)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onShowRendererError', () => {
    it('receives message from bus', () => {
      communication.onShowRendererError(callbackRecorder.getCallback())

      const data = { message: 'Error', hint: 'Hint', fatal: false }
      fakeMessageBus.triggerOn(messages.RENDERER_SHOW_ERROR, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onMysteriumClientUp', () => {
    it('receives message from bus', () => {
      communication.onMysteriumClientUp(callbackRecorder.getCallback())

      fakeMessageBus.triggerOn(messages.HEALTHCHECK_UP)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onMysteriumClientDown', () => {
    it('receives message from bus', () => {
      communication.onMysteriumClientDown(callbackRecorder.getCallback())

      fakeMessageBus.triggerOn(messages.HEALTHCHECK_DOWN)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onUserSettings', () => {
    it('receives message from bus', () => {
      communication.onUserSettings(callbackRecorder.getCallback())

      const data = { showDisconnectNotifications: true }
      fakeMessageBus.triggerOn(messages.USER_SETTINGS, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })
})
