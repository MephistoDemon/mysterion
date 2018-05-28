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

import type {MainCommunication} from '../../src/app/communication/main-communication'
import type {
  AppErrorDTO, ConnectionStatusChangeDTO, CurrentIdentityChangeDTO, HealthCheckDTO,
  MysteriumClientLogDTO,
  ProposalUpdateDTO,
  RequestTermsDTO, TermsAnsweredDTO
} from '../../src/app/communication/dto'
import type {UserSettings} from '../../src/app/user-settings/user-settings'

/**
 * Allows tracking method invocations.
 */
class FakeMainCommunication implements MainCommunication {
  _invokedMethods: Set<string> = new Set()

  /**
   * Returns whether given instance method was invoked.
   *
   * @param method - method of this class to check
   * @returns {*|boolean}
   */
  wasInvoked (method: Function): boolean {
    return this._invokedMethods.has(method.name)
  }

  onRendererBooted (callback: () => void): void {
    this._registerMethod(this.onRendererBooted)
  }

  sendRendererShowErrorMessage (_error: string): void {
    this._registerMethod(this.sendRendererShowErrorMessage)
  }

  sendRendererShowError (data: AppErrorDTO): void {
    this._registerMethod(this.sendRendererShowError)
  }

  sendMysteriumClientIsReady (): void {
    this._registerMethod(this.sendMysteriumClientIsReady)
  }

  sendMysteriumClientLog (dto: MysteriumClientLogDTO): void {
    this._registerMethod(this.sendMysteriumClientLog)
  }

  sendProposals (proposals: ProposalUpdateDTO): void {
    this._registerMethod(this.sendProposals)
  }

  sendConnectionCancelRequest () {
    this._registerMethod(this.sendConnectionCancelRequest)
  }

  sendConnectionRequest () {
    this._registerMethod(this.sendConnectionRequest)
  }

  sendTermsRequest (data: RequestTermsDTO): void {
    this._registerMethod(this.sendTermsRequest)
  }

  sendTermsAccepted (): void {
    this._registerMethod(this.sendTermsAccepted)
  }

  sendHealthCheck (data: HealthCheckDTO): void {
    this._registerMethod(this.sendHealthCheck)
  }

  sendUserSettings (data: UserSettings): void {
    this._registerMethod(this.sendUserSettings)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeDTO) => void): void {
    this._registerMethod(this.onConnectionStatusChange)
  }

  onCurrentIdentityChange (callback: (CurrentIdentityChangeDTO) => void): void {
    this._registerMethod(this.onCurrentIdentityChange)
  }

  onProposalUpdateRequest (callback: () => void): void {
    this._registerMethod(this.onProposalUpdateRequest)
  }

  onTermsAnswered (callback: (TermsAnsweredDTO) => void): void {
    this._registerMethod(this.onTermsAnswered)
  }

  onUserSettingsRequest (callback: () => void): void {
    this._registerMethod(this.onUserSettingsRequest)
  }

  onUserSettingsUpdate (callback: (UserSettings) => void): void {
    this._registerMethod(this.onUserSettingsUpdate)
  }

  _registerMethod (method: Function): void {
    this._invokedMethods.add(method.name)
  }
}

export default FakeMainCommunication
