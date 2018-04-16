// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeData, MysteriumClientLogData} from './dto'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendConnectionStatusChange (data: ConnectionStatusChangeData) {
    return this._send(messages.CONNECTION_STATUS_CHANGED, data)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogData) => void) {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  _send (channel: string, data: mixed) {
    this._messageBus.send(channel, data)
  }

  _on (channel: string, callback: (data: any) => void) {
    this._messageBus.on(channel, (event, data) => {
      callback(data)
    })
  }
}

export default RendererCommunication
