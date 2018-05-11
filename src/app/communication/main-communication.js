// @flow

import messages from './messages'
import type {MessageBus} from './messageBus'
import type {
  RequestConnectionDto,
  ConnectionStatusChangeDTO,
  CurrentIdentityChangeDTO,
  MysteriumClientLogDTO,
  ProposalUpdateDto,
  RequestTermsDTO,
  TermsAnsweredDTO
} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  sendErrorToRenderer (error: string, hint: string = '', fatal: boolean = true) {
    this._send(messages.APP_ERROR, {message: error, hint: hint, fatal: fatal})
  }

  // TODO: remaining other messages
  sendMysteriumClientLog (dto: MysteriumClientLogDTO): void {
    this._send(messages.MYSTERIUM_CLIENT_LOG, dto)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeDTO) => void): void {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  onCurrentIdentityChange (callback: (CurrentIdentityChangeDTO) => void) {
    this._on(messages.CURRENT_IDENTITY_CHANGED, callback)
  }

  onRendererLoaded (callback: () => void) {
    this._on(messages.RENDERER_LOADED, callback)
  }

  onProposalUpdateRequest (callback: () => void) {
    this._on(messages.PROPOSALS_UPDATE, callback)
  }

  onTermsAnswered (callback: (TermsAnsweredDTO) => void) {
    this._on(messages.TERMS_ANSWERED, callback)
  }

  sendProposals (proposals: ProposalUpdateDto) {
    this._send(messages.PROPOSALS_UPDATE, proposals)
  }

  sendConnectionCancelRequest () {
    this._send(messages.CONNECTION_CANCEL)
  }

  sendConnectionRequest (data: RequestConnectionDto) {
    this._send(messages.CONNECTION_REQUEST, data)
  }

  sendTermsRequest (data: RequestTermsDTO) {
    this._send(messages.TERMS_REQUESTED, data)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default MainCommunication
