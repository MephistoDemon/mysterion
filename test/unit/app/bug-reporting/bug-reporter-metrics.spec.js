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
import {BugReporterMetrics, EXTRA, METRICS, NOT_SET, TAGS} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import type {Metric} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import type {MapSyncDTO} from '../../../../src/libraries/map-sync'
import FakeMapSyncCommunication from '../../../helpers/fake_map_sync_communication'
import {MapSync} from '../../../../src/libraries/map-sync'

describe('BugReporterMetrics', () => {
  let mapSync: MapSync<Metric>
  let bugReporterMetrics: BugReporterMetrics

  beforeEach(() => {
    mapSync = new MapSync()
    bugReporterMetrics = new BugReporterMetrics(mapSync)
  })

  describe('initialization', () => {
    it('creates Metrics type', () => {
      const totalMetricCount = Object.values(TAGS).length + Object.values(EXTRA).length
      expect(Object.values(METRICS).length).to.eql(totalMetricCount)
    })
  })

  describe('get/set', () => {
    it('sets tag metric', () => {
      const metricKey = METRICS.IDENTITY_UNLOCKED
      const metricValue = true

      expect(mapSync.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(mapSync.get(metricKey)).to.eql(metricValue)
    })

    it('sets extra metric', () => {
      const metricKey = EXTRA.CONNECTION_IP
      const metricValue = {ip: '192.168.1.1'}

      expect(mapSync.get(metricKey)).to.be.undefined
      bugReporterMetrics.set(metricKey, metricValue)
      expect(mapSync.get(metricKey)).to.eql(metricValue)
    })
  })

  describe('getMetrics', () => {
    it('returns value for non-used metrics', () => {
      const unsetMetric = TAGS.CLIENT_RUNNING
      const data = bugReporterMetrics.getMetrics()
      expect(data.tags[unsetMetric]).to.be.eql(NOT_SET)
    })

    it('returns value for used metrics', () => {
      const metricKey = TAGS.IDENTITY_UNLOCKED
      const metricValue = true
      bugReporterMetrics.set(metricKey, metricValue)
      const data = bugReporterMetrics.getMetrics()
      expect(data.tags[metricKey]).to.be.eql(mapSync.get(metricKey))
    })

    it('gets all metrics', () => {
      const metricKey = TAGS.IDENTITY_UNLOCKED
      const metricValue = true
      bugReporterMetrics.set(metricKey, metricValue)

      const data = bugReporterMetrics.getMetrics()
      const tagKeys = Object.keys(data.tags)
      const extraKeys = Object.keys(data.extra)

      expect(tagKeys.length).to.eql(Object.values(TAGS).length)
      expect(extraKeys.length).to.eql(Object.values(EXTRA).length)

      for (let tagKey of Object.values(TAGS)) {
        expect(tagKeys).to.contain(tagKey)
        // $FlowFixMe
        expect(data.tags[tagKey]).to.deep.equal(mapSync.get(tagKey) || NOT_SET)
      }
      for (let extraKey of Object.values(EXTRA)) {
        expect(extraKeys).to.contain(extraKey)
        // $FlowFixMe
        expect(data.extra[extraKey]).to.deep.equal(mapSync.get(extraKey) || NOT_SET)
      }
    })
  })

  describe('syncWith', () => {
    it('sends metric via message bus', () => {
      const communication = new FakeMapSyncCommunication()
      bugReporterMetrics.startSyncing(communication)

      let lastUpdate: ?MapSyncDTO<Metric> = null
      communication.onMapUpdate(update => {
        lastUpdate = update
      })

      const metricKey = METRICS.CONNECTION_IP
      const metricValue = {ip: '127.0.0.1'}
      bugReporterMetrics.set(metricKey, metricValue)

      if (lastUpdate == null) {
        throw new Error('Map have been not updated')
      }
      expect(lastUpdate).to.not.be.null
      expect(lastUpdate.metric).to.eql(metricKey)
      expect(lastUpdate.value).to.eql(metricValue)
    })

    it('receives metric via message bus', () => {
      const communication = new FakeMapSyncCommunication()
      bugReporterMetrics.startSyncing(communication)

      const metricKey = METRICS.CONNECTION_IP
      const newValue = {ip: '192.168.1.1'}
      communication.sendMapUpdate({
        metric: metricKey,
        value: newValue
      })

      const updatedValue = mapSync.get(metricKey)
      expect(updatedValue).to.be.eql(newValue)
    })
  })
})
