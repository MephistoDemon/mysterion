import MainCommunication from '../../../../src/app/communication/main-communication'
import messages from '../../../../src/app/communication/messages'
import FakeMessageBus from '../../../helpers/fakeMessageBus'

class Recorder {
  constructor () {
    this.invoked = false
    this.data = null
  }
  getCallback () {
    return this._record.bind(this)
  }

  _record (data) {
    this.invoked = true
    this.data = data
  }
}

// TODO: add specs for new methods

describe('MainCommunication', () => {
  let fakeMessageBus
  let communication
  let recorder

  beforeEach(() => {
    fakeMessageBus = new FakeMessageBus()
    communication = new MainCommunication(fakeMessageBus)
    recorder = new Recorder()
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
      communication.onConnectionStatusChange(recorder.getCallback())

      const data = { oldStatus: 'old', newStatus: 'new' }
      fakeMessageBus.triggerOn(messages.CONNECTION_STATUS_CHANGED, data)

      expect(recorder.invoked).to.eql(true)
      expect(recorder.data).to.eql(data)
    })
  })

  describe('onCurrentIdentityChange', () => {
    it('receives message from bus', () => {
      communication.onCurrentIdentityChange(recorder.getCallback())

      const data = { id: '0xC001FACE00000123' }
      fakeMessageBus.triggerOn(messages.CURRENT_IDENTITY_CHANGED, data)

      expect(recorder.invoked).to.eql(true)
      expect(recorder.data).to.eql(data)
    })
  })

  describe('onRendererLoaded', () => {
    it('receives message from bus', () => {
      communication.onRendererLoaded(recorder.getCallback())
      fakeMessageBus.triggerOn(messages.RENDERER_LOADED)

      expect(recorder.invoked).to.eql(true)
    })
  })
})
