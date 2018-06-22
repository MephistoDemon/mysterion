
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
