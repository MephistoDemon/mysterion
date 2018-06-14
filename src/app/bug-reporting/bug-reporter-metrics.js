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

function isEquivalent (a: any, b: any): boolean {
  if (typeof (a) !== typeof (b)) {
    return false
  }
  if (typeof (a) !== 'object') {
    return a === b
  }

  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i]
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  return true
}

class BugReporterMetrics {
  IdentityUnlocked = 'identity_unlocked'
  ProposalsFetched = 'proposals_fetched'
  HealthCheckTime = 'last_health_check'
  ConnectionCreated = 'connection_created'
  ConnectionStatus = 'connection_status'
  ConnectionStatistics = 'connection_statistics'
  ConnectionIP = 'connection_ip'
  ClientStarted = 'client_started'
  StartTime = 'start_time'

  _tags: Map<string, any> = new Map()
  _extra: Map<string, any> = new Map()
  _messageBus: MessageBus

  constructor () {
    // set initial values for metrics
    this.set(this.IdentityUnlocked, UNKNOWN, this._tags)
    this.set(this.ProposalsFetched, UNKNOWN, this._tags)
    this.set(this.ConnectionCreated, UNKNOWN, this._tags)
    this.set(this.ClientStarted, UNKNOWN, this._tags)
    this.set(this.StartTime, UNKNOWN, this._tags)
    this.set(this.ConnectionStatus, UNKNOWN, this._extra)
    this.set(this.ConnectionStatistics, UNKNOWN, this._extra)
    this.set(this.ConnectionIP, UNKNOWN, this._extra)
    this.set(this.HealthCheckTime, UNKNOWN, this._extra)
  }

  syncWith (messageBus: MessageBus) {
    this._messageBus = messageBus
    this._messageBus.on(messages.METRIC_SYNC, (data: any) => {
      const dto: MetricSyncDTO = (data: MetricSyncDTO)
      this.set(dto.metric, dto.value)
    })
  }

  set (metric: string, value: mixed, metricStorage: ?Map<string, any> = null) {
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
    if (isEquivalent(oldValue, value)) {
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

  addMetricsTo (data: any) {
    this._tags.forEach((value, metric) => {
      data.tags[metric] = value
    })
    this._extra.forEach((value, metric) => {
      data.extra[metric] = value
    })
  }

  static dateTimeString (): string {
    return (new Date()).toUTCString()
  }
}

const bugReporterMetrics = new BugReporterMetrics()

export {bugReporterMetrics}
