// @flow
import RavenJs from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import {logLevel} from '../../libraries/mysterium-client'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import type {BugReporter} from './interface'

class BugReporterRenderer implements BugReporter {
  install (url: string, vue: Object, config: Object) {
    RavenJs
      .config(url, config)
      .install()
      .addPlugin(RavenVue, vue)
  }

  setUser (userData: IdentityDTO) {
    RavenJs.setUserContext(userData)
  }

  captureException (err: Error): void {
    RavenJs.captureException(err)
  }

  pushToLogCache (level: logLevel.LOG | logLevel.ERROR, data: string) {
    pushToLogCache(level, data)
  }
}

function getRavenInstance (): Object {
  return RavenJs
}

export default BugReporterRenderer
export {getRavenInstance}
