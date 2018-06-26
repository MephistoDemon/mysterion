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
import axios from 'axios'
import type {Container} from '../app/di'
import {BugReporterMetrics} from '../app/bug-reporting/bug-reporter-metrics'
import HttpTequilapiClient from '../libraries/mysterium-tequilapi/client'
import TequilapiClientWithMetrics from '../app/bug-reporting/tequilapi-metrics'
import {TIMEOUT_DEFAULT} from '../libraries/mysterium-tequilapi/timeouts'
import type {TequilapiClient} from '../libraries/mysterium-tequilapi/client'
import AxiosAdapter from '../libraries/mysterium-tequilapi/adapters/axios-adapter'

function bootstrap (container: Container) {
  container.constant(
    'tequilapiClient.config',
    {
      'baseURL': 'http://127.0.0.1:4050'
    }
  )
  container.service(
    'tequilapiClient',
    ['bugReporterMetrics', 'tequilapiClient.config'],
    (bugReporterMetrics: BugReporterMetrics, config: Object) => {
      const axiosInstance = axios.create({
        baseURL: config.baseURL,
        headers: {
          'Cache-Control': 'no-cache, no-store'
        }
      })
      const axiosAdapter = new AxiosAdapter(axiosInstance, TIMEOUT_DEFAULT)
      const client: TequilapiClient = new HttpTequilapiClient(axiosAdapter)
      const clientWithMetrics = new TequilapiClientWithMetrics(client, bugReporterMetrics)
      return clientWithMetrics
    }
  )
}

export default bootstrap
