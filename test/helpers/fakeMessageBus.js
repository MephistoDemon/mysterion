// @flow
import type {MessageBus} from '../../src/app/communication/messageBus'

type Callback = (data?: mixed) => void

export default class FakeMessageBus implements MessageBus {
  lastChannel: ?string
  lastData: mixed
  _callbacks: { [string]: Callback }

  constructor () {
    this.lastChannel = null
    this.lastData = null
    this._callbacks = {}
  }

  send (channel: string, data?: mixed): void {
    this.lastChannel = channel
    this.lastData = data
  }

  on (channel: string, callback: Callback): void {
    this._callbacks[channel] = callback
  }

  triggerOn (channel: string, data?: mixed): void {
    const callback = this._callbacks[channel]
    if (!callback) {
      return
    }
    callback(data)
  }

  clean () {
    this.lastChannel = null
    this.lastData = null
  }
}
