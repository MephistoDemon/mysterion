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
import {describe, it, expect, beforeEach} from '../../../helpers/dependencies'
import {BugReporterMetrics, EXTRA, METRICS, NOT_SET, TAGS, getMetrics} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import type {Metric} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import type {MapSyncDTO} from '../../../../src/libraries/map-sync'
import FakeMapSyncCommunication from '../../../helpers/fakeMapSyncCommunication'

describe('BugReporterMetrics', () => {
  let bugReporterMetrics: BugReporterMetrics

  beforeEach(() => {
    bugReporterMetrics = new BugReporterMetrics()
  })

  describe('get/set', () => {
    it('sets tag metric', () => {
      const metricKey = METRICS.IDENTITY_UNLOCKED
      const metricValue = true

      expect(bugReporterMetrics.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
    })

    it('sets extra metric', () => {
      const metricKey = METRICS.IDENTITY_UNLOCKED
      const metricValue = true

      expect(bugReporterMetrics.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
    })
  })

  describe('getMetrics', () => {
    it('gets all metrics', () => {
      const data = getMetrics(bugReporterMetrics)
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

      expect(data).to.deep.equal(getMetrics(bugReporterMetrics))
    })
  })

  describe('syncWith', () => {
    it('sends/receives metric via message bus', () => {
      const communication = new FakeMapSyncCommunication()
      bugReporterMetrics.syncWith(communication)

      let lastUpdate: ?MapSyncDTO<Metric> = null
      communication.onMapUpdate(update => {
        lastUpdate = update
      })

      const metricKey = METRICS.CONNECTION_IP
      const metricValue = '{ip: "127.0.0.1"}'
      bugReporterMetrics.set(metricKey, metricValue)

      if (lastUpdate == null) {
        throw new Error('Map have been not updated')
      }
      expect(lastUpdate).to.not.be.null
      expect(lastUpdate.metric).to.eql(metricKey)
      expect(lastUpdate.value).to.eql(metricValue)

      const newValue = '{ip: "192.168.1.1"}'
      communication.sendMapUpdate({
        metric: metricKey,
        value: newValue
      })

      const updatedValue = bugReporterMetrics.get(metricKey)
      expect(updatedValue).to.be.eql(newValue)
    })
  })
})
