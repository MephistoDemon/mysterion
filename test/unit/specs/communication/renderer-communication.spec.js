import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import messages from '../../../../src/app/communication/index'
import FakeMessageBus from '../../../helpers/fakeMessageBus'

describe('RendererCommunication', () => {
  let fakeMessageBus
  let communication

  beforeEach(() => {
    fakeMessageBus = new FakeMessageBus()
    communication = new RendererCommunication(fakeMessageBus)
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

  describe('sendRendererLoaded', () => {
    it('sends message to bus', () => {
      communication.sendRendererLoaded()

      expect(fakeMessageBus.lastChannel).to.eql(messages.RENDERER_LOADED)
      expect(fakeMessageBus.lastData).to.eql(undefined)
    })
  })

  describe('onMysteriumClientLog', () => {
    it('receives message from bus', () => {
      let callbackData = null
      communication.onMysteriumClientLog((data) => {
        callbackData = data
      })

      const data = { level: 'INFO', data: 'Test log' }
      fakeMessageBus.triggerOn(messages.MYSTERIUM_CLIENT_LOG, data)

      expect(callbackData).to.eql(data)
    })
  })
})
