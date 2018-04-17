// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeDTO, IdentitySetDTO, MysteriumClientLogDTO} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendMysteriumClientLog (dto: MysteriumClientLogDTO): void {
    this._send(messages.MYSTERIUM_CLIENT_LOG, dto)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeDTO) => void): void {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  onIdentitySet (callback: (IdentitySetDTO) => void) {
    this._on(messages.IDENTITY_SET, callback)
  }

  onRendererLoaded (callback: () => void) {
    this._on(messages.RENDERER_LOADED, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default MainCommunication
