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

const UNKNOWN = 'no'

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

type MetricTags = $Values<typeof TAGS>
type MetricExtra = $Values<typeof EXTRA>
type Metric = MetricTags | MetricExtra

/**
 * Collects and synchronizes data used in BugReporter
 */
class BugReporterMetrics {
  Tags = TAGS
  Extra = EXTRA

  _tags: Map<MetricTags, any> = new Map()
  _extra: Map<MetricExtra, any> = new Map()
  _messageBus: MessageBus

  constructor () {
    // set initial values for metrics
    for (let tagKey of Object.keys(this.Tags)) {
      this.set(this.Tags[tagKey], UNKNOWN, this._tags)
    }
    for (let tagKey of Object.keys(this.Extra)) {
      this.set(this.Extra[tagKey], UNKNOWN, this._extra)
    }
  }

  syncWith (messageBus: MessageBus): void {
    this._messageBus = messageBus
    this._messageBus.on(messages.METRIC_SYNC, (data: any) => {
      const dto: MetricSyncDTO = (data: MetricSyncDTO)
      this.set(dto.metric, dto.value)
    })
  }

  set (metric: Metric, value: mixed, metricStorage: ?Map<Metric, any> = null): void {
    // detect default storage for metric (tags or extra)
    if (!metricStorage) {
      if (this._tags.has(metric)) {
        this.set(metric, value, this._tags)
      } else {
        this.set(metric, value, this._extra)
      }
      return
    }

    const oldValue = metricStorage.get(metric)
    if (JSON.stringify(oldValue) === JSON.stringify(value)) {
      // metric's value was not updated
      return
    }

    metricStorage.set(metric, value)

    if (this._messageBus) {
      const data: MetricSyncDTO = {
        metric: metric,
        value: value
      }
      this._messageBus.send(messages.METRIC_SYNC, data)
    }
  }

  get (metric: Metric): any {
    if (this._tags.has(metric)) {
      return this._tags.get(metric)
    } else if (this._extra.has(metric)) {
      return this._extra.get(metric)
    }
    return null
  }

  addMetricsTo (data: any): void {
    this._tags.forEach((value, metric) => {
      data.tags[metric] = value
    })
    this._extra.forEach((value, metric) => {
      data.extra[metric] = value
    })
  }

  dateTimeString (): string {
    return (new Date()).toUTCString()
  }
}

const bugReporterMetrics = new BugReporterMetrics()

export {bugReporterMetrics, UNKNOWN}
