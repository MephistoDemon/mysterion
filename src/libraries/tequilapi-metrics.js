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

import ConnectionStatusDTO from './mysterium-tequilapi/dto/connection-status'
import {BugReporterMetrics, METRICS} from '../app/bug-reporting/bug-reporter-metrics'
import NodeHealthcheckDTO from './mysterium-tequilapi/dto/node-healthcheck'
import ProposalDTO from './mysterium-tequilapi/dto/proposal'
import ProposalsFilter from './mysterium-tequilapi/dto/proposals-filter'
import {TIMEOUT_DISABLED} from './mysterium-tequilapi/timeouts'
import ConnectionRequestDTO from './mysterium-tequilapi/dto/connection-request'
import ConnectionStatisticsDTO from './mysterium-tequilapi/dto/connection-statistics'
import ConnectionIPDTO from './mysterium-tequilapi/dto/connection-ip'
import type {TequilapiClient} from './mysterium-tequilapi/client'
import IdentityDTO from './mysterium-tequilapi/dto/identity'
import ConsumerLocationDTO from './mysterium-tequilapi/dto/consumer-location'

class TequilapiClientWithMetrics implements TequilapiClient {
  bugReporterMetrics: BugReporterMetrics
  client: TequilapiClient

  constructor (client: TequilapiClient, bugReporterMetrics: BugReporterMetrics) {
    this.client = client
    this.bugReporterMetrics = bugReporterMetrics
  }

  async stop (): Promise<void> {
    return this.client.stop()
  }

  async identitiesList (): Promise<Array<IdentityDTO>> {
    return this.client.identitiesList()
  }

  async identityCreate (passphrase: string): Promise<IdentityDTO> {
    return this.client.identityCreate(passphrase)
  }

  async healthCheck (timeout: ?number): Promise<NodeHealthcheckDTO> {
    const result = await this.client.healthCheck(timeout)
    this.bugReporterMetrics.setWithCurrentDateTime(METRICS.HEALTH_CHECK_TIME)
    return result
  }

  async identityUnlock (id: string, passphrase: string): Promise<void> {
    this.bugReporterMetrics.set(METRICS.IDENTITY_UNLOCKED, false)
    await this.client.identityUnlock(id, passphrase)
    this.bugReporterMetrics.set(METRICS.IDENTITY_UNLOCKED, true)
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    const result = await this.client.findProposals(filter)
    if (!result || result.length === 0) {
      this.bugReporterMetrics.set(METRICS.PROPOSALS_FETCHED_ONCE, false)
    } else {
      this.bugReporterMetrics.set(METRICS.PROPOSALS_FETCHED_ONCE, true)
    }
    return result
  }

  async connectionCreate (request: ConnectionRequestDTO, timeout: ?number = TIMEOUT_DISABLED): Promise<ConnectionStatusDTO> {
    this.bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, false)
    const result = await this.client.connectionCreate(request, timeout)
    this.bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, true)
    return result
  }

  async connectionStatus (): Promise<ConnectionStatusDTO> {
    const result = await this.client.connectionStatus()
    this.bugReporterMetrics.set(METRICS.CONNECTION_STATUS, result)
    return result
  }

  async connectionCancel (): Promise<void> {
    await this.client.connectionCancel()
    this.bugReporterMetrics.set(METRICS.CONNECTION_ACTIVE, false)
  }

  async connectionIP (timeout: ?number): Promise<ConnectionIPDTO> {
    const result = await this.client.connectionIP(timeout)
    this.bugReporterMetrics.set(METRICS.CONNECTION_IP, result)
    return result
  }

  async connectionStatistics (): Promise<ConnectionStatisticsDTO> {
    const result = await this.client.connectionStatistics()
    this.bugReporterMetrics.set(METRICS.CONNECTION_STATISTICS, result)
    return result
  }

  async location (timeout: ?number): Promise<ConsumerLocationDTO> {
    return this.client.location(timeout)
  }
}

export default TequilapiClientWithMetrics
