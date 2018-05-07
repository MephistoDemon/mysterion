// @flow
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import config from './config'
import IdentityDTO from '../../libraries/api/client/dto/identity'

declare var SENTRY_CONFIG: Object

const setUser = (userData: IdentityDTO) => {
  RavenJs.setUserContext(userData)
  Raven.setContext({
    user: userData
  })
}

interface BugReporter {
  install (options: Object): void;

  captureException (ex: Error | string): void;
}

class RendererBugReporter implements BugReporter {
  install (vue: Object) {
    config.release = remote.getGlobal('__version')
    const url = remote.getGlobal('__sentryURL')
    RavenJs.config(url, config).install().addPlugin(RavenVue, vue)
  }

  captureException (ex: Error | string) {
    RavenJs.captureException(ex)
  }

  getRavenInstance (): Object {
    return RavenJs
  }
}

class MainBugReporter implements BugReporter {
  install () {
    config.release = global.__version
    const url = SENTRY_CONFIG.privateURL
    Raven.config(url, config).install()
  }

  captureException (ex: Error | string) {
    Raven.captureException(ex)
  }
}

export default {
  renderer: new RendererBugReporter(),
  main: new MainBugReporter(),
  setUser,
  pushToLogCache
}
