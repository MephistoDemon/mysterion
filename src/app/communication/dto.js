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
import type {ConnectionStatus} from '../../libraries/mysterium-tequilapi/dto/connection-status-enum'
import type { LogLevel } from '../logging/mysterion-log-levels'
import type { Country } from '../countries'

export type ConnectionStatusChangeDTO = {
  oldStatus: ConnectionStatus,
  newStatus: ConnectionStatus
}

export type CurrentIdentityChangeDTO = {
  id: string
}

export type CountriesDTO = Array<Country>

export type RequestConnectionDTO = {
  providerId: string
}

export type RequestTermsDTO = {
  htmlContent: string
}

export type TermsAnsweredDTO = {
  isAccepted: boolean
}

export type AppErrorDTO = {
  message: string,
  hint: string,
  fatal: boolean
}

export type LogDTO = {
  level: LogLevel,
  data: mixed
}
