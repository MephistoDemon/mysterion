// @flow

import messages from './messages'
import type {MessageBus} from './messageBus'
import type {
  HealthCheckDTO,
  RequestConnectionDTO,
  ConnectionStatusChangeDTO,
  CurrentIdentityChangeDTO,
  MysteriumClientLogDTO,
  ProposalUpdateDTO,
  RequestTermsDTO,
  TermsAnsweredDTO,
  AppErrorDTO
} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  onRendererLoadStarted (callback: () => void) {
    this._on(messages.RENDERER_LOAD_STARTED, callback)
  }

  /**
   * Notifies the renderer that we're good to go
   */
  sendRendererLoadContinue () {
    this._send(messages.RENDERER_LOAD_CONTINUE)
  }

  sendRendererShowErrorMessage (error: string) {
    this.sendRendererShowError({
      message: error,
      hint: '',
      fatal: true
    })
  }

  sendRendererShowError (data: AppErrorDTO) {
    this._send(messages.RENDERER_SHOW_ERROR, data)
  }

  sendMysteriumClientLog (dto: MysteriumClientLogDTO): void {
    this._send(messages.MYSTERIUM_CLIENT_LOG, dto)
  }

  sendProposals (proposals: ProposalUpdateDTO) {
    this._send(messages.PROPOSALS_UPDATE, proposals)
  }

  sendConnectionCancelRequest () {
    this._send(messages.CONNECTION_CANCEL)
  }

  sendConnectionRequest (data: RequestConnectionDTO) {
    this._send(messages.CONNECTION_REQUEST, data)
  }

  sendTermsRequest (data: RequestTermsDTO) {
    this._send(messages.TERMS_REQUESTED, data)
  }

  sendTermsAccepted () {
    this._send(messages.TERMS_ACCEPTED)
  }

  sendHealthCheck (data: HealthCheckDTO) {
    this._send(messages.HEALTHCHECK, data)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeDTO) => void): void {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  onCurrentIdentityChange (callback: (CurrentIdentityChangeDTO) => void) {
    this._on(messages.CURRENT_IDENTITY_CHANGED, callback)
  }

  onProposalUpdateRequest (callback: () => void) {
    this._on(messages.PROPOSALS_UPDATE, callback)
  }

  onTermsAnswered (callback: (TermsAnsweredDTO) => void) {
    this._on(messages.TERMS_ANSWERED, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default MainCommunication
