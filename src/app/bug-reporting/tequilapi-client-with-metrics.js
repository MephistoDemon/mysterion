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

import ConnectionStatusDTO from '../../libraries/mysterium-tequilapi/dto/connection-status'
import { BugReporterMetrics, METRICS } from './bug-reporter-metrics'
import type { NodeHealthcheckDTO } from '../../libraries/mysterium-tequilapi/dto/node-healthcheck'
import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import ProposalsFilter from '../../libraries/mysterium-tequilapi/dto/proposals-filter'
import { TIMEOUT_DISABLED } from '../../libraries/mysterium-tequilapi/timeouts'
import ConnectionRequestDTO from '../../libraries/mysterium-tequilapi/dto/connection-request'
import ConnectionStatisticsDTO from '../../libraries/mysterium-tequilapi/dto/connection-statistics'
import ConnectionIPDTO from '../../libraries/mysterium-tequilapi/dto/connection-ip'
import type { TequilapiClient } from '../../libraries/mysterium-tequilapi/client'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import ConsumerLocationDTO from '../../libraries/mysterium-tequilapi/dto/consumer-location'
import IdentityRegistrationDTO from '../../libraries/mysterium-tequilapi/dto/identity-registration'

class TequilapiClientWithMetrics implements TequilapiClient {
  _bugReporterMetrics: BugReporterMetrics
  _client: TequilapiClient

  constructor (client: TequilapiClient, bugReporterMetrics: BugReporterMetrics) {
    this._client = client
    this._bugReporterMetrics = bugReporterMetrics
  }

  async stop (): Promise<void> {
    return this._client.stop()
  }

  async identitiesList (): Promise<Array<IdentityDTO>> {
    return this._client.identitiesList()
  }

  async identityCreate (passphrase: string): Promise<IdentityDTO> {
    return this._client.identityCreate(passphrase)
  }

  async healthCheck (timeout: ?number): Promise<NodeHealthcheckDTO> {
    const result = await this._client.healthCheck(timeout)
    this._bugReporterMetrics.setWithCurrentDateTime(METRICS.HEALTH_CHECK_TIME)
    return result
  }

  async identityUnlock (id: string, passphrase: string): Promise<void> {
    this._bugReporterMetrics.set(METRICS.IDENTITY_UNLOCKED, false)
    await this._client.identityUnlock(id, passphrase)
    this._bugReporterMetrics.set(METRICS.IDENTITY_UNLOCKED, true)
  }

  async identityRegistration (id: string): Promise<IdentityRegistrationDTO> {
    const result = await this._client.identityRegistration(id)
    this._bugReporterMetrics.set(METRICS.IDENTITY_REGISTERED, result.registered)
    return result
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    const result = await this._client.findProposals(filter)
    if (!result || result.length === 0) {
      this._bugReporterMetrics.set(METRICS.PROPOSALS_FETCHED_ONCE, false)
    } else {
      this._bugReporterMetrics.set(METRICS.PROPOSALS_FETCHED_ONCE, true)
    }
    return result
  }

  async connectionCreate (request: ConnectionRequestDTO, timeout: ?number = TIMEOUT_DISABLED): Promise<ConnectionStatusDTO> {
    this._bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, false)
    const result = await this._client.connectionCreate(request, timeout)
    this._bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, true)
    return result
  }

  async connectionStatus (): Promise<ConnectionStatusDTO> {
    const result = await this._client.connectionStatus()
    this._bugReporterMetrics.set(METRICS.CONNECTION_STATUS, result)
    return result
  }

  async connectionCancel (): Promise<void> {
    await this._client.connectionCancel()
    this._bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, false)
  }

  async connectionIP (timeout: ?number): Promise<ConnectionIPDTO> {
    const result = await this._client.connectionIP(timeout)
    this._bugReporterMetrics.set(METRICS.CONNECTION_IP, result)
    return result
  }

  async connectionStatistics (): Promise<ConnectionStatisticsDTO> {
    const result = await this._client.connectionStatistics()
    this._bugReporterMetrics.set(METRICS.CONNECTION_STATISTICS, result)
    return result
  }

  async location (timeout: ?number): Promise<ConsumerLocationDTO> {
    return this._client.location(timeout)
  }
}

export default TequilapiClientWithMetrics
