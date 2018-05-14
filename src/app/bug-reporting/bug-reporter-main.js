// @flow
import Raven from 'raven'
import {pushToLogCache} from './logsCache'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import type {BugReporter} from './interface'
import {logLevel} from '../../libraries/mysterium-client'

class BugReporterMain implements BugReporter {
  install (url: string, config: Object) {
    Raven.config(url, config).install()
  }

  setUser (userData: IdentityDTO) {
    Raven.setContext({
      user: userData
    })
  }

  captureException (err: Error): void {
    Raven.captureException(err)
  }

  pushToLogCache (level: logLevel.LOG | logLevel.ERROR, data: string) {
    pushToLogCache(level, data)
  }
}

export default BugReporterMain
