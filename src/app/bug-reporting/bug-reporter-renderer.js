// @flow
import RavenJs from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import {logLevels} from '../../libraries/mysterium-client'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import type {BugReporter} from './interface'

class BugReporterRenderer implements BugReporter {
  _url: string
  _vue: Object
  _config: Object

  constructor (url: string, vue: Object, config: Object) {
    this._url = url
    this._vue = vue
    this._config = config
  }

  install () {
    RavenJs
      .config(this._url, this._config)
      .install()
      .addPlugin(RavenVue, this._vue)
  }

  setUser (userData: IdentityDTO) {
    RavenJs.setUserContext({ id: userData.id })
  }

  captureException (err: Error): void {
    RavenJs.captureException(err)
  }

  pushToLogCache (level: logLevels.LOG | logLevels.ERROR, data: string) {
    pushToLogCache(level, data)
  }
}

function getRavenInstance (): Object {
  return RavenJs
}

export default BugReporterRenderer
export {getRavenInstance}
