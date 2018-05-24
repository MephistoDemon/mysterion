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
import os from 'os'
import {logLevels} from '../libraries/mysterium-client'
import {getLogCache} from '../app/bug-reporting/logsCache'

function bootstrap (container: Container) {
  const extendedProcess = (process: { type?: string })
  container.service(
    'bugReporter.config',
    ['mysterionReleaseID'],
    (mysterionReleaseID): RavenOptions => {
      return {
        captureUnhandledRejections: true,
        release: mysterionReleaseID,
        tags: {
          environment: process.env.NODE_ENV || '',
          process: extendedProcess.type || '',
          electron: process.versions.electron || '',
          chrome: process.versions.chrome || '',
          platform: os.platform(),
          platform_release: os.release()
        },
        dataCallback: (data) => {
          data.extra.logs = {
            [logLevels.LOG]: getLogCache(logLevels.LOG),
            [logLevels.ERROR]: getLogCache(logLevels.ERROR)
          }
          return data
        },
        autoBreadcrumbs: {
          console: true
        }
      }
    }
  )
}

export default bootstrap
