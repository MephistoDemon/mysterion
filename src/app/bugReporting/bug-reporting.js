// @flow
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import config from './config'

declare var SENTRY_CONFIG: Object

const setUser = (userData: any) => {
  RavenJs.setUserContext(userData)
  Raven.setContext({
    user: userData
  })
}

interface BugReporter {
  raven: any;
  captureException (ex: any, options: any): void;
}

class RendererBugReporter implements BugReporter {
  raven: any

  constructor () {
    this.raven = RavenJs
  }

  install (vue: any) {
    config.release = remote.getGlobal('__version')
    const url = remote.getGlobal('__sentryURL')
    RavenJs.config(url, config).install().addPlugin(RavenVue, vue)
    return RavenJs
  }

  captureException (ex: any, options: any) {
    RavenJs.captureException(ex, options)
  }
}

class MainBugReporter implements BugReporter {
  raven: any

  constructor () {
    this.raven = Raven
  }

  install () {
    config.release = global.__version
    const url = SENTRY_CONFIG.privateURL
    Raven.config(url, config).install()
    return Raven
  }

  captureException (ex: any, options: any) {
    Raven.captureException(ex, options)
  }
}

export default {
  renderer: new RendererBugReporter(),
  main: new MainBugReporter(),
  setUser,
  pushToLogCache
}
