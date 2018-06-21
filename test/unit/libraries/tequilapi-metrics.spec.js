
// @flow

import {expect, beforeEach, describe, it} from '../../helpers/dependencies'
import TequilapiClientWithMetrics from '../../../src/libraries/tequilapi-metrics'
import axios from 'axios/index'
import AxiosAdapter from '../../../src/libraries/mysterium-tequilapi/adapters/axios-adapter'
import MockAdapter from 'axios-mock-adapter'
import {BugReporterMetrics, METRICS} from '../../../src/app/bug-reporting/bug-reporter-metrics'
import HttpTequilapiClient from '../../../src/libraries/mysterium-tequilapi/client'
import NodeHealthcheckDTO from '../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'

describe('HttpTequilapiClientWithMetrics', () => {
  let api
  let metrics
  let apiMetrics
  let mock

  beforeEach(() => {
    const axioInstance = axios.create()
    const http = new AxiosAdapter(axioInstance)
    api = new HttpTequilapiClient(http)
    metrics = new BugReporterMetrics()
    apiMetrics = new TequilapiClientWithMetrics(api, metrics)
    mock = new MockAdapter(axioInstance)
  })

  describe('healthcheck()', () => {
    it('returns response', async () => {
      const response = {
        uptime: '1h10m',
        process: 1111,
        version: {
          commit: '0bcccc',
          branch: 'master',
          buildNumber: '001'
        }
      }
      mock.onGet('healthcheck').reply(200, response)

      expect(metrics.get(METRICS.HealthCheckTime)).to.be.undefined
      const healthcheck = await apiMetrics.healthCheck()
      expect(healthcheck).to.deep.equal(new NodeHealthcheckDTO(response))
      expect(metrics.get(METRICS.HealthCheckTime)).to.be.not.undefined
    })
  })
})
