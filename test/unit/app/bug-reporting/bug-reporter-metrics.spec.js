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
import {describe, it, expect} from '../../../helpers/dependencies'
import {bugReporterMetrics, EXTRA, METRICS, TAGS} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import type {MetricSyncDTO} from '../../../../src/app/communication/dto'

describe('BugReporterMetrics', () => {
  it('sets tag metric', () => {
    const metricKey = METRICS.IdentityUnlocked
    const metricValue = true

    expect(bugReporterMetrics.get(metricKey)).to.be.eql(undefined)
    bugReporterMetrics.set(metricKey, metricValue)
    expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
  })

  it('sets extra metric', () => {
    const metricKey = METRICS.HealthCheckTime
    const metricValue = bugReporterMetrics.dateTimeString()

    expect(bugReporterMetrics.get(metricKey)).to.eql(undefined)
    bugReporterMetrics.set(metricKey, metricValue)
    expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
  })

  it('add metrics to object', () => {
    const data = {
      tags: {},
      extra: {}
    }
    bugReporterMetrics.addMetricsTo(data)
    const tagKeys = Object.keys(data.tags)
    const extraKeys = Object.keys(data.extra)

    expect(tagKeys.length + extraKeys.length).to.eql(Object.values(METRICS).length)

    for (let tagKey of Object.values(TAGS)) {
      expect(tagKeys).contains(tagKey)
    }
    for (let extraKey of Object.values(EXTRA)) {
      expect(extraKeys).contains(extraKey)
    }
  })

  it('send/receive metric via message bus', () => {
    const messageBus = new FakeMessageBus()
    bugReporterMetrics.syncWith(messageBus)

    const metricKey = METRICS.ConnectionIP
    const metricValue = '{ip: "127.0.0.1"}'
    bugReporterMetrics.set(metricKey, metricValue)

    expect(messageBus.lastData).to.not.be.eql(null)
    const dto: MetricSyncDTO = (messageBus.lastData: any)
    expect(dto).to.not.be.eql(null)
    expect(dto.metric).to.eql(metricKey)
    expect(dto.value).to.eql(metricValue)

    if (messageBus.lastChannel) {
      const newValue = '{ip: "192.168.1.1"}'
      const updateDto: MetricSyncDTO = {
        metric: metricKey,
        value: newValue
      }
      messageBus.triggerOn(messageBus.lastChannel, updateDto)

      const updatedValue = bugReporterMetrics.get(metricKey)
      expect(updatedValue).to.be.eql(newValue)
    } else {
      expect(messageBus.lastChannel).to.not.be.eql(null)
    }
  })
})
