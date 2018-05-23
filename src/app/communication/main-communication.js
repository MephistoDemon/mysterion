/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
import type {UserSettingsDTO} from '../userSettings'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  onRendererBooted (callback: () => void) {
    this._on(messages.RENDERER_BOOTED, callback)
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

  /**
   * Notifies the renderer that we're good to go
   */
  sendMysteriumClientIsReady () {
    this._send(messages.MYSTERIUM_CLIENT_READY)
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

  sendUserSettings (data: UserSettingsDTO) {
    this._send(messages.USER_SETTINGS, data)
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

  onUserSettingsUpdate (callback: (UserSettingsDTO) => void) {
    this._on(messages.USER_SETTINGS_SET, callback)
  }

  onUserSettingsRequest (callback: () => void) {
    this._on(messages.USER_SETTINGS_GET, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default MainCommunication
