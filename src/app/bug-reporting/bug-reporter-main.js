// @flow
import Raven from 'raven'
import {pushToLogCache} from './logsCache'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import type {BugReporter} from './interface'
import {logLevel} from '../../libraries/mysterium-client'

class BugReporterMain implements BugReporter {
  _url: string
  _config: Object

  constructor (url: string, config: Object) {
    this._url = url
    this._config = config
  }

  install () {
    Raven.config(this._url, this._config).install()
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
