// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeData, IdentitySetData, MysteriumClientLogData} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendMysteriumClientLog (data: MysteriumClientLogData): void {
    this._send(messages.MYSTERIUM_CLIENT_LOG, data)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeData) => void): void {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  onIdentitySet (callback: (IdentitySetData) => void) {
    this._on(messages.IDENTITY_SET, callback)
  }

  onRendererLoaded (callback: () => void) {
    this._on(messages.RENDERER_LOADED, callback)
  }

  _send (channel: string, data: mixed): void {
    this._messageBus.send(channel, data)
  }

  _on (channel: string, callback: (data: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default MainCommunication
