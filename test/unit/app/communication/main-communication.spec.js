// @flow
import MainCommunication from '../../../../src/app/communication/main-communication'
import messages from '../../../../src/app/communication/messages'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import { describe, beforeEach, it, expect } from '../../../helpers/dependencies'
import { CallbackRecorder } from '../../../helpers/utils'
import ProposalDTO from '../../../../src/libraries/mysterium-tequilapi/dto/proposal'

describe('MainCommunication', () => {
  let fakeMessageBus
  let communication
  let callbackRecorder

  beforeEach(() => {
    fakeMessageBus = new FakeMessageBus()
    communication = new MainCommunication(fakeMessageBus)
    callbackRecorder = new CallbackRecorder()
  })

  describe('sendMysteriumClientLog', () => {
    it('sends message to bus', () => {
      const data = { level: 'INFO', data: 'Test log' }
      communication.sendMysteriumClientLog(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.MYSTERIUM_CLIENT_LOG)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendProposals', () => {
    it('sends message to bus', () => {
      const data = [new ProposalDTO({ id: 1 })]
      communication.sendProposals(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.PROPOSALS_UPDATE)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendConnectionCancelRequest', () => {
    it('sends message to bus', () => {
      communication.sendConnectionCancelRequest()

      expect(fakeMessageBus.lastChannel).to.eql(messages.CONNECTION_CANCEL)
    })
  })

  describe('sendConnectionRequest', () => {
    it('sends message to bus', () => {
      const data = { providerId: '0x123' }
      communication.sendConnectionRequest(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.CONNECTION_REQUEST)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendTermsRequest', () => {
    it('sends message to bus', () => {
      const data = { htmlContent: 'Cool terms' }
      communication.sendTermsRequest(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.TERMS_REQUESTED)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendTermsAccepted', () => {
    it('sends message to bus', () => {
      communication.sendTermsAccepted()

      expect(fakeMessageBus.lastChannel).to.eql(messages.TERMS_ACCEPTED)
    })
  })

  describe('sendMysteriumClientIsReady', () => {
    it('sends message to bus', () => {
      communication.sendMysteriumClientIsReady()

      expect(fakeMessageBus.lastChannel).to.eql(messages.MYSTERIUM_CLIENT_READY)
    })
  })

  describe('sendRendererShowError', () => {
    it('sends message to bus', () => {
      const data = { message: 'Message', hint: 'Hint', fatal: false }
      communication.sendRendererShowError(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.RENDERER_SHOW_ERROR)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('sendHealthCheck', () => {
    it('sends message to bus', () => {
      const data = { isRunning: true }
      communication.sendHealthCheck(data)

      expect(fakeMessageBus.lastChannel).to.eql(messages.HEALTHCHECK)
      expect(fakeMessageBus.lastData).to.eql(data)
    })
  })

  describe('onConnectionStatusChange', () => {
    it('receives message from bus', () => {
      communication.onConnectionStatusChange(callbackRecorder.getCallback())

      const data = { oldStatus: 'old', newStatus: 'new' }
      fakeMessageBus.triggerOn(messages.CONNECTION_STATUS_CHANGED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onCurrentIdentityChange', () => {
    it('receives message from bus', () => {
      communication.onCurrentIdentityChange(callbackRecorder.getCallback())

      const data = { id: '0xC001FACE00000123' }
      fakeMessageBus.triggerOn(messages.CURRENT_IDENTITY_CHANGED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })

  describe('onRendererBooted', () => {
    it('receives message from bus', () => {
      communication.onRendererBooted(callbackRecorder.getCallback())
      fakeMessageBus.triggerOn(messages.RENDERER_BOOTED)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onProposalUpdateRequest', () => {
    it('receives message from bus', () => {
      communication.onProposalUpdateRequest(callbackRecorder.getCallback())
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })

  describe('onTermsAnswered(', () => {
    it('receives message from bus', () => {
      communication.onTermsAnswered(callbackRecorder.getCallback())

      const data = { answer: true }
      fakeMessageBus.triggerOn(messages.TERMS_ANSWERED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.argument).to.eql(data)
    })
  })
})
