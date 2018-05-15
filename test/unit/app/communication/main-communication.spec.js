// @flow
import MainCommunication from '../../../../src/app/communication/main-communication'
import messages from '../../../../src/app/communication/messages'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import { describe, beforeEach, it } from '../../../helpers/dependencies'
import { CallbackRecorder } from '../../../helpers/utils'

// TODO: add specs for new methods

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

  describe('onConnectionStatusChange', () => {
    it('receives message from bus', () => {
      communication.onConnectionStatusChange(callbackRecorder.getCallback())

      const data = { oldStatus: 'old', newStatus: 'new' }
      fakeMessageBus.triggerOn(messages.CONNECTION_STATUS_CHANGED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.data).to.eql(data)
    })
  })

  describe('onCurrentIdentityChange', () => {
    it('receives message from bus', () => {
      communication.onCurrentIdentityChange(callbackRecorder.getCallback())

      const data = { id: '0xC001FACE00000123' }
      fakeMessageBus.triggerOn(messages.CURRENT_IDENTITY_CHANGED, data)

      expect(callbackRecorder.invoked).to.eql(true)
      expect(callbackRecorder.data).to.eql(data)
    })
  })

  describe('onRendererLoaded', () => {
    it('receives message from bus', () => {
      communication.onRendererLoaded(callbackRecorder.getCallback())
      fakeMessageBus.triggerOn(messages.RENDERER_LOADED)

      expect(callbackRecorder.invoked).to.eql(true)
    })
  })
})
