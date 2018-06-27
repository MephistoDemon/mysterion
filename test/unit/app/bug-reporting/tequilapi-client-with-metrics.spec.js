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

import {expect, beforeEach, describe, it} from '../../../helpers/dependencies'
import TequilapiClientWithMetrics from '../../../../src/app/bug-reporting/tequilapi-client-with-metrics'
import {BugReporterMetrics, METRICS} from '../../../../src/app/bug-reporting/bug-reporter-metrics'
import EmptyTequilapiClientMock from '../../renderer/store/modules/empty-tequilapi-client-mock'
import {MapSync} from '../../../../src/libraries/map-sync'
import type {Metric} from '../../../../src/app/bug-reporting/bug-reporter-metrics'

describe('TequilapiClientWithMetrics', () => {
  let api
  let mapSync: MapSync<Metric>
  let metrics
  let apiMetrics

  beforeEach(() => {
    api = new EmptyTequilapiClientMock()
    mapSync = new MapSync()
    metrics = new BugReporterMetrics(mapSync)
    apiMetrics = new TequilapiClientWithMetrics(api, metrics)
  })

  describe('healthcheck()', () => {
    it('sets HEALTH_CHECK_TIME metric value', async () => {
      expect(mapSync.get(METRICS.HEALTH_CHECK_TIME)).to.be.undefined
      await apiMetrics.healthCheck()
      expect(mapSync.get(METRICS.HEALTH_CHECK_TIME)).to.be.not.undefined
      expect(mapSync.get(METRICS.HEALTH_CHECK_TIME)).to.be.a('string')
    })
  })
})
