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
import MapSync from '../../libraries/map-sync'

/**
 * Used as default metric value in Sentry
 * Later metric value will be replaces using method 'set'
 * @type {string}
 */
const NOT_SET = 'N/A'

const TAGS = {
  IdentityUnlocked: 'identity_unlocked',
  ProposalsFetched: 'proposals_fetched',
  ConnectionCreated: 'connection_created',
  ClientStarted: 'client_started',
  StartTime: 'start_time'
}

const EXTRA = {
  HealthCheckTime: 'last_health_check',
  ConnectionStatus: 'connection_status',
  ConnectionStatistics: 'connection_statistics',
  ConnectionIP: 'connection_ip'
}

const METRICS = {}
Object.assign(METRICS, TAGS)
Object.assign(METRICS, EXTRA)

export type Metric = $Values<typeof METRICS>

export type RavenData = {
  tags: {
    [id: string]: mixed
  },
  extra: {
    [id: string]: mixed
  },
}

/**
 * Collects and synchronizes data used in BugReporter
 */
class BugReporterMetrics extends MapSync<Metric> {
  dateTimeString (): string {
    return (new Date()).toUTCString()
  }

  addMetricsTo (data: RavenData): void {
    this._setValues((Object.values(TAGS): any), data.tags)
    this._setValues((Object.values(EXTRA): any), data.extra)
  }

  _setValues (metrics: Array<Metric>, dest: any) {
    for (let metric of metrics) {
      dest[metric] = this.get(metric) || NOT_SET
    }
  }
}

const bugReporterMetrics = new BugReporterMetrics()

export { bugReporterMetrics, METRICS, TAGS, EXTRA, NOT_SET }
