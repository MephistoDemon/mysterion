// @flow

import messages from './messages'
import type {MessageBus} from './messageBus'
import type {
  ConnectionStatusChangeDTO,
  CurrentIdentityChangeDTO,
  MysteriumClientLogDTO,
  RequestConnectionDTO,
  ProposalUpdateDTO,
  RequestTermsDTO,
  TermsAnsweredDTO,
  AppErrorDTO,
  HealthCheckDTO
} from './dto'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  sendRendererLoadStarted (): void {
    return this._send(messages.RENDERER_LOAD_STARTED)
  }

  onRendererLoadContinue (callback: () => void) {
    this._on(messages.RENDERER_LOAD_CONTINUE, callback)
  }

  onShowRendererError (callback: (AppErrorDTO) => void): void {
    this._on(messages.RENDERER_SHOW_ERROR, callback)
  }

  sendConnectionStatusChange (dto: ConnectionStatusChangeDTO): void {
    return this._send(messages.CONNECTION_STATUS_CHANGED, dto)
  }

  sendCurrentIdentityChange (dto: CurrentIdentityChangeDTO): void {
    return this._send(messages.CURRENT_IDENTITY_CHANGED, dto)
  }

  sendProposalUpdateRequest () {
    return this._send(messages.PROPOSALS_UPDATE)
  }

  sendTermsAnswered (dto: TermsAnsweredDTO): void {
    return this._send(messages.TERMS_ANSWERED, dto)
  }

  onConnectionRequest (callback: (RequestConnectionDTO) => void) {
    this._on(messages.CONNECTION_REQUEST, callback)
  }

  onDisconnectionRequest (callback: () => void) {
    this._on(messages.CONNECTION_CANCEL, callback)
  }

  onProposalUpdate (callback: (ProposalUpdateDTO) => void) {
    this._on(messages.PROPOSALS_UPDATE, callback)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogDTO) => void): void {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  onTermsRequest (callback: (RequestTermsDTO) => void): void {
    this._on(messages.TERMS_REQUESTED, callback)
  }

  onTermsAccepted (callback: () => void): void {
    this._on(messages.TERMS_ACCEPTED, callback)
  }

  onHealthCheck (callback: (HealthCheckDTO) => void): void {
    this._on(messages.HEALTHCHECK, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default RendererCommunication
