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
import {bugReporterMetrics, EXTRA, METRICS, NOT_SET, TAGS} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import type {MapSyncDTO} from '../../../../src/app/communication/dto'
import type {Metric} from '../../../../src/app/bug-reporting/bug-reporter-metrics'

describe('BugReporterMetrics', () => {
  describe('get/set', () => {
    it('sets tag metric', () => {
      const metricKey = METRICS.IdentityUnlocked
      const metricValue = true

      expect(bugReporterMetrics.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
    })

    it('sets extra metric', () => {
      const metricKey = METRICS.HealthCheckTime
      const metricValue = bugReporterMetrics.dateTimeString()

      expect(bugReporterMetrics.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
    })

    it('adds metrics to object', () => {
      const data = {
        tags: {},
        extra: {}
      }
      bugReporterMetrics.addMetricsTo(data)
      const tagKeys = Object.keys(data.tags)
      const extraKeys = Object.keys(data.extra)

      expect(tagKeys.length + extraKeys.length).to.eql(Object.values(METRICS).length)

      for (let tagKey of Object.values(TAGS)) {
        expect(tagKeys).to.contain(tagKey)
        // $FlowFixMe
        expect(data.tags[tagKey]).to.be.eql(bugReporterMetrics.get(tagKey) || NOT_SET)
      }
      for (let extraKey of Object.values(EXTRA)) {
        expect(extraKeys).to.contain(extraKey)
        // $FlowFixMe
        expect(data.extra[extraKey]).to.be.eql(bugReporterMetrics.get(extraKey) || NOT_SET)
      }
    })

    it('sends/receives metric via message bus', () => {
      const messageBus = new FakeMessageBus()
      bugReporterMetrics.syncWith(messageBus)

      const metricKey = METRICS.ConnectionIP
      const metricValue = '{ip: "127.0.0.1"}'
      bugReporterMetrics.set(metricKey, metricValue)

      expect(messageBus.lastData).to.be.not.null
      const dto: MapSyncDTO<Metric> = (messageBus.lastData: any)
      expect(dto.metric).to.eql(metricKey)
      expect(dto.value).to.eql(metricValue)

      if (!messageBus.lastChannel) {
        throw new Error('No last channel')
      }

      const newValue = '{ip: "192.168.1.1"}'
      const updateDto: MapSyncDTO<Metric> = {
        metric: metricKey,
        value: newValue
      }
      messageBus.triggerOn(messageBus.lastChannel, updateDto)

      const updatedValue = bugReporterMetrics.get(metricKey)
      expect(updatedValue).to.be.eql(newValue)
    })
  })
})
