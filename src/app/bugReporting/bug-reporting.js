import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import config from './config'

const setUser = (userData) => {
  RavenJs.setUserContext(userData)
  Raven.setContext({
    user: userData
  })
}

class RendererBugReporter {
  constructor () {
    this.raven = RavenJs
  }

  install (vue) {
    config.release = remote.getGlobal('__version')
    const url = remote.getGlobal('__sentryURL')
    RavenJs.config(url, config).install().addPlugin(RavenVue, vue)
    return RavenJs
  }

  captureException (ex, options) {
    RavenJs.captureException(ex, options)
  }
}

class MainBugReporter {
  constructor () {
    this.raven = Raven
  }

  install () {
    config.release = global.__version
    const url = process.env.SENTRY.privateURL
    Raven.config(url, config).install()
    return Raven
  }

  captureException (ex, options) {
    Raven.captureException(ex, options)
  }
}

export default {
  renderer: new RendererBugReporter(),
  main: new MainBugReporter(),
  setUser,
  pushToLogCache
}
