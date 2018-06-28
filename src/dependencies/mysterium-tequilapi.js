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
import type {Container} from '../app/di'
import {BugReporterMetrics} from '../app/bug-reporting/bug-reporter-metrics'
import TequilapiClientWithMetrics from '../app/bug-reporting/tequilapi-client-with-metrics'
import type {TequilapiClient} from '../libraries/mysterium-tequilapi/client'
import tequilapiClientFactory from '../libraries/mysterium-tequilapi/client-factory'

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
      const client: TequilapiClient = tequilapiClientFactory(config.baseURL)
      const clientWithMetrics = new TequilapiClientWithMetrics(client, bugReporterMetrics)
      return clientWithMetrics
    }
  )
}

export default bootstrap
