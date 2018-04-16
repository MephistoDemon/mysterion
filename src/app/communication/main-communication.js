// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeData, MysteriumClientLogData} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendMysteriumClientLog (data: MysteriumClientLogData) {
    this._send(messages.MYSTERIUM_CLIENT_LOG, data)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeData) => void) {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
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

export default MainCommunication
