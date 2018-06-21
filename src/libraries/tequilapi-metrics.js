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

import HttpTequilapiClient from './mysterium-tequilapi/client'
import ConnectionStatusDTO from './mysterium-tequilapi/dto/connection-status'
import {BugReporterMetrics, METRICS} from '../app/bug-reporting/bug-reporter-metrics'
import type {HttpInterface} from './mysterium-tequilapi/adapters/interface'
import NodeHealthcheckDTO from './mysterium-tequilapi/dto/node-healthcheck'
import ProposalDTO from './mysterium-tequilapi/dto/proposal'
import ProposalsFilter from './mysterium-tequilapi/dto/proposals-filter'
import {TIMEOUT_DISABLED} from './mysterium-tequilapi/timeouts'
import ConnectionRequestDTO from './mysterium-tequilapi/dto/connection-request'
import ConnectionStatisticsDTO from './mysterium-tequilapi/dto/connection-statistics'
import ConnectionIPDTO from './mysterium-tequilapi/dto/connection-ip'

class HttpTequilapiClientWithMetrics extends HttpTequilapiClient {
  bugReporterMetrics: BugReporterMetrics

  constructor (http: HttpInterface, bugReporterMetrics: BugReporterMetrics) {
    super(http)
    this.bugReporterMetrics = bugReporterMetrics
  }

  async healthCheck (timeout: ?number): Promise<NodeHealthcheckDTO> {
    const result = await super.healthCheck(timeout)
    this.bugReporterMetrics.set(METRICS.HealthCheckTime, this.bugReporterMetrics.dateTimeString())
    return result
  }

  async identityUnlock (id: string, passphrase: string): Promise<void> {
    this.bugReporterMetrics.set(METRICS.IdentityUnlocked, false)
    await super.identityUnlock(id, passphrase)
    this.bugReporterMetrics.set(METRICS.IdentityUnlocked, true)
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    const result = await super.findProposals(filter)
    if (!result || result.length === 0) {
      this.bugReporterMetrics.set(METRICS.ProposalsFetched, false)
    } else {
      this.bugReporterMetrics.set(METRICS.ProposalsFetched, true)
    }
    return result
  }

  async connectionCreate (request: ConnectionRequestDTO, timeout: ?number = TIMEOUT_DISABLED): Promise<ConnectionStatusDTO> {
    this.bugReporterMetrics.set(METRICS.ConnectionCreated, false)
    const result = await super.connectionCreate(request, timeout)
    this.bugReporterMetrics.set(METRICS.ConnectionCreated, true)
    return result
  }

  async connectionStatus (): Promise<ConnectionStatusDTO> {
    const result = await super.connectionStatus()
    this.bugReporterMetrics.set(METRICS.ConnectionStatus, result)
    return result
  }

  async connectionCancel (): Promise<void> {
    await super.connectionCancel()
    this.bugReporterMetrics.set(METRICS.ConnectionCreated, false)
  }

  async connectionIP (timeout: ?number): Promise<ConnectionIPDTO> {
    const result = await super.connectionIP(timeout)
    this.bugReporterMetrics.set(METRICS.ConnectionIP, result)
    return result
  }

  async connectionStatistics (): Promise<ConnectionStatisticsDTO> {
    const result = await super.connectionStatistics()
    this.bugReporterMetrics.set(METRICS.ConnectionStatistics, result)
    return result
  }
}

export default HttpTequilapiClientWithMetrics
