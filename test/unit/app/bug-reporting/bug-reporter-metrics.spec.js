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
import {bugReporterMetrics, UNKNOWN} from '../../../../src/app/bug-reporting/bug-reporter-metrics'

describe('BugReporterMetrics', () => {
  it('sets tag metric', () => {
    const metricKey = bugReporterMetrics.Tags.IdentityUnlocked
    const metricValue = true

    expect(bugReporterMetrics.get(metricKey)).to.eql(UNKNOWN)
    bugReporterMetrics.set(metricKey, metricValue)
    expect(bugReporterMetrics.get(metricKey)).to.eql(metricValue)
  })

  it('sets extra metric', () => {
    const metricKey = bugReporterMetrics.Extra.HealthCheckTime
    const metricValue = bugReporterMetrics.dateTimeString()

    expect(bugReporterMetrics.get(metricKey)).to.eql(UNKNOWN)
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

    expect(tagKeys.length).to.eql(Object.values(bugReporterMetrics.Tags).length)
    expect(extraKeys.length).to.eql(Object.values(bugReporterMetrics.Extra).length)

    for (let tagKey of Object.values(bugReporterMetrics.Tags)) {
      expect(tagKeys).contains(tagKey)
    }
    for (let extraKey of Object.values(bugReporterMetrics.Extra)) {
      expect(extraKeys).contains(extraKey)
    }
  })
})
