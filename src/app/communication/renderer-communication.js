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
  ConnectionStatusChangeDTO,
  CurrentIdentityChangeDTO,
  RequestConnectionDTO,
  ProposalUpdateDTO,
  RequestTermsDTO,
  TermsAnsweredDTO,
  AppErrorDTO
} from './dto'

import type {UserSettings} from '../user-settings/user-settings'
import type {Metric} from '../bug-reporting/bug-reporter-metrics'
import type {MapSyncCommunication, MapSyncDTO} from '../../libraries/map-sync'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication implements MapSyncCommunication<Metric> {
  _messageBus: MessageBus

  constructor (messageBus: MessageBus) {
    this._messageBus = messageBus
  }

  sendRendererBooted (): void {
    return this._send(messages.RENDERER_BOOTED)
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

  sendUserSettingsRequest (): void {
    return this._send(messages.USER_SETTINGS_REQUEST)
  }

  sendUserSettingsUpdate (dto: UserSettings): void {
    return this._send(messages.USER_SETTINGS_UPDATE, dto)
  }

  sendMapUpdate (data: MapSyncDTO<Metric>): void {
    this._send(messages.METRIC_SYNC, data)
  }

  onMapUpdate (callback: (MapSyncDTO<Metric>) => void): void {
    this._on(messages.METRIC_SYNC, callback)
  }

  onUserSettings (callback: (UserSettings) => void): void {
    this._on(messages.USER_SETTINGS, callback)
  }

  onConnectionRequest (callback: (RequestConnectionDTO) => void) {
    this._on(messages.CONNECTION_REQUEST, callback)
  }

  // TODO: unify naming 'disconnection' and 'connection cancel'
  onDisconnectionRequest (callback: () => void) {
    this._on(messages.CONNECTION_CANCEL, callback)
  }

  onProposalUpdate (callback: (ProposalUpdateDTO) => void) {
    this._on(messages.PROPOSALS_UPDATE, callback)
  }

  onMysteriumClientIsReady (callback: () => void) {
    this._on(messages.MYSTERIUM_CLIENT_READY, callback)
  }

  onMysteriumClientUp (callback: () => void): void {
    this._on(messages.HEALTHCHECK_UP, callback)
  }

  onMysteriumClientDown (callback: () => void): void {
    this._on(messages.HEALTHCHECK_DOWN, callback)
  }

  onTermsRequest (callback: (RequestTermsDTO) => void): void {
    this._on(messages.TERMS_REQUESTED, callback)
  }

  onTermsAccepted (callback: () => void): void {
    this._on(messages.TERMS_ACCEPTED, callback)
  }

  _send (channel: string, dto: mixed): void {
    this._messageBus.send(channel, dto)
  }

  _on (channel: string, callback: (dto: any) => void): void {
    this._messageBus.on(channel, callback)
  }
}

export default RendererCommunication
