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
