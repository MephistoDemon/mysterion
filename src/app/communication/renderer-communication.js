// @flow
import messages from './index'
import type {MessageBus} from './messageBus'
import type {ConnectionStatusChangeData, IdentitySetData, MysteriumClientLogData} from './dto'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  // TODO: remaining other messages

  sendConnectionStatusChange (data: ConnectionStatusChangeData): void {
    return this._send(messages.CONNECTION_STATUS_CHANGED, data)
  }

  sendIdentitySet (data: IdentitySetData): void {
    return this._send(messages.IDENTITY_SET, data)
  }

  sendRendererLoaded (): void {
    return this._send(messages.RENDERER_LOADED)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogData) => void): void {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  _send (channel: string, data: mixed): void {
    this._messageBus.send(channel, data)
  }

  _on (channel: string, callback: (data: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default RendererCommunication
