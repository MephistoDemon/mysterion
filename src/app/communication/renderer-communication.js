// @flow

import messages from './messages'
import type {MessageBus} from './messageBus'
import type {
  ConnectionStatusChangeDTO,
  CurrentIdentityChangeDTO,
  MysteriumClientLogDTO,
  RequestConnectionDTO,
  ProposalUpdateDTO,
  RequestTermsDto,
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

  // TODO: remaining other messages

  sendConnectionStatusChange (dto: ConnectionStatusChangeDTO): void {
    return this._send(messages.CONNECTION_STATUS_CHANGED, dto)
  }

  sendCurrentIdentityChange (dto: CurrentIdentityChangeDTO): void {
    return this._send(messages.CURRENT_IDENTITY_CHANGED, dto)
  }

  sendProposalUpdateRequest () {
    return this._send(messages.PROPOSALS_UPDATE)
  }

  sendRendererLoaded (): void {
    return this._send(messages.RENDERER_LOADED)
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

  onTermsRequest (callback: (RequestTermsDto) => void): void {
    this._on(messages.TERMS_REQUESTED, callback)
  }

  onTermsAccepted (callback: () => void): void {
    this._on(messages.TERMS_ACCEPTED, callback)
  }

  onAppStart (callback: () => void): void {
    this._on(messages.APP_START, callback)
  }

  onAppError (callback: (AppErrorDTO) => void): void {
    this._on(messages.APP_ERROR, callback)
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
