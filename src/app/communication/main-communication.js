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

interface MainCommunication {
  onRendererBooted (callback: () => void): void,

  sendRendererShowErrorMessage (error: string): void,

  sendRendererShowError (data: AppErrorDTO): void,

  sendMysteriumClientIsReady (): void,

  sendMysteriumClientLog (dto: MysteriumClientLogDTO): void,

  sendProposals (proposals: ProposalUpdateDTO): void,

  sendConnectionCancelRequest (): void,

  sendConnectionRequest (data: RequestConnectionDTO): void,

  sendTermsRequest (data: RequestTermsDTO): void,

  sendTermsAccepted (): void,

  sendHealthCheck (data: HealthCheckDTO): void,

  onConnectionStatusChange (callback: (ConnectionStatusChangeDTO) => void): void,

  onCurrentIdentityChange (callback: (CurrentIdentityChangeDTO) => void): void,

  onProposalUpdateRequest (callback: () => void): void,

  onTermsAnswered (callback: (TermsAnsweredDTO) => void): void
}

export type { MainCommunication }
