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

import type {MessageBus} from '../communication/messageBus'
import messages from '../communication/messages'
import type {MetricSyncDTO} from '../communication/dto'

/**
 * Used as default metric value in Sentry
 * Later metric value will be replaces using method 'set'
 * @type {string}
 */
const NOT_SET = 'no'

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

type Metric = $Values<typeof METRICS>

type RavenData = {
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
class BugReporterMetrics {
  _metrics: Map<Metric, any> = new Map()
  _messageBus: ?MessageBus = null

  syncWith (messageBus: MessageBus): void {
    this._messageBus = messageBus
    this._messageBus.on(messages.METRIC_SYNC, (data: any) => {
      const dto: MetricSyncDTO = (data: MetricSyncDTO)
      this.set(dto.metric, dto.value)
    })
  }

  set (metric: Metric, value: mixed): void {
    const oldValue = this._metrics.get(metric)
    if (JSON.stringify(oldValue) === JSON.stringify(value)) {
      // metric's value was not updated
      return
    }

    this._metrics.set(metric, value)

    if (this._messageBus) {
      const data: MetricSyncDTO = {
        metric: metric,
        value: value
      }
      this._messageBus.send(messages.METRIC_SYNC, data)
    }
  }

  get (metric: Metric): any {
    return this._metrics.get(metric)
  }

  addMetricsTo (data: RavenData): void {
    this._setValues((Object.values(TAGS): any), data.tags)
    this._setValues((Object.values(EXTRA): any), data.extra)
  }

  dateTimeString (): string {
    return (new Date()).toUTCString()
  }

  _setValues (metrics: Array<Metric>, dest: any) {
    for (let metric of metrics) {
      dest[metric] = this.get(metric) || NOT_SET
    }
  }
}

const bugReporterMetrics = new BugReporterMetrics()

export { bugReporterMetrics, METRICS, TAGS, EXTRA, NOT_SET }
