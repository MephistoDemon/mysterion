// @flow
import type {BugReporter} from './interface'
import Raven from 'raven'
import {pushToLogCache} from './logsCache'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import {logLevels} from '../../libraries/mysterium-client'

class BugReporterMain implements BugReporter {
  raven: Raven

  constructor (raven: Raven) {
    this.raven = raven
  }

  setUser (userData: IdentityDTO) {
    this.raven.setContext({
      user: userData
    })
  }

  captureException (err: Error): void {
    this.raven.captureException(err)
  }

  pushToLogCache (level: logLevels.LOG | logLevels.ERROR, data: string) {
    pushToLogCache(level, data)
  }
}

export default BugReporterMain
