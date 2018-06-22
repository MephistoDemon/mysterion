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

import {expect, beforeEach, describe, it} from '../../helpers/dependencies'
import TequilapiClientWithMetrics from '../../../src/libraries/tequilapi-metrics'
import {BugReporterMetrics, METRICS} from '../../../src/app/bug-reporting/bug-reporter-metrics'
import EmptyTequilapiClientMock from '../renderer/store/modules/empty-tequilapi-client-mock'

describe('HttpTequilapiClientWithMetrics', () => {
  let api
  let metrics
  let apiMetrics

  beforeEach(() => {
    api = new EmptyTequilapiClientMock()
    metrics = new BugReporterMetrics()
    apiMetrics = new TequilapiClientWithMetrics(api, metrics)
  })

  describe('healthcheck()', () => {
    it('returns response', async () => {
      expect(metrics._get(METRICS.HEALTH_CHECK_TIME)).to.be.undefined
      await apiMetrics.healthCheck()
      expect(metrics._get(METRICS.HEALTH_CHECK_TIME)).to.be.not.undefined
      expect(typeof metrics._get(METRICS.HEALTH_CHECK_TIME)).to.be.eql('string')
    })
  })
})
