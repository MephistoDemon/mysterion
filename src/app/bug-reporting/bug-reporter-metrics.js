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
import {MapSync} from '../../libraries/map-sync'

/**
 * Used as default metric value in Sentry
 * Later metric value will be replaces using method 'set'
 * @type {string}
 */
const NOT_SET = 'N/A'

const TAGS = {
  IDENTITY_UNLOCKED: 'identity_unlocked',
  PROPOSALS_FETCHED: 'proposals_fetched',
  CONNECTION_CREATED: 'connection_created',
  CLIENT_STARTED: 'client_started',
  START_TIME: 'start_time'
}

const EXTRA = {
  HEALTH_CHECK_TIME: 'last_health_check',
  CONNECTION_STATUS: 'connection_status',
  CONNECTION_STATISTICS: 'connection_statistics',
  CONNECTION_IP: 'connection_ip'
}

const METRICS = {}
Object.assign(METRICS, TAGS)
Object.assign(METRICS, EXTRA)

// alternative to: type Metric = 'identity_unlocked' | 'proposals_fetched' | 'last_health_check' ...
type Metric = $Values<typeof METRICS>
type keyValueMap = { [id: string]: mixed }
type RavenData = {
  tags: keyValueMap,
  extra: keyValueMap,
}

/**
 * Collects and synchronizes data used in BugReporter
 */
export class BugReporterMetrics extends MapSync<Metric> {
  getMetrics (): RavenData {
    const data = { tags: {}, extra: {} }
    data.tags = this._setValues((Object.values(TAGS): any))
    data.extra = this._setValues((Object.values(EXTRA): any))
    return data
  }

  setWithCurrentDateTime (metric: Metric) {
    super.set(metric, dateTimeString())
  }

  _setValues (metrics: Array<Metric>): keyValueMap {
    const result = {}
    for (let metric of metrics) {
      result[metric] = this._get(metric) || NOT_SET
    }
    return result
  }
}

function dateTimeString (): string {
  return (new Date()).toUTCString()
}

export { METRICS, TAGS, EXTRA, NOT_SET, dateTimeString }
export type {RavenData, Metric}
