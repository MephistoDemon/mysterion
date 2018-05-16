// @flow
import type {BugReporter} from './interface'
import Raven from 'raven'
import {pushToLogCache} from './logsCache'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import {logLevels} from '../../libraries/mysterium-client'

class BugReporterRenderer implements BugReporter {
  raven: Raven

  constructor (raven: Raven) {
    this.raven = raven
  }

  setUser (userData: IdentityDTO) {
    this.raven.setUserContext(userData)
  }

  captureMessage (message: string, context: ?any): void {
    this.raven.captureMessage(message, {
      extra: context
    })
  }

  captureException (err: Error, context: ?any): void {
    this._captureException(err, 'error', context)
  }

  captureInfoException (err: Error, context: ?any): void {
    this._captureException(err, 'info', context)
  }

  pushToLogCache (level: logLevels.LOG | logLevels.ERROR, data: string) {
    pushToLogCache(level, data)
  }

  _captureException (err: Error, level: string, context: ?any): void {
    this.raven.captureException(err, { level, extra: context })
  }
}

export default BugReporterRenderer
