import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import {logLevel} from '../../libraries/mysterium-client/index'
import {pushToLogCache, getLogCache} from './logsCache'

const config = {
  captureUnhandledRejections: true,
  tags: {
    environment: process.env.NODE_ENV,
    process: process.type,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    platform: os.platform(),
    platform_release: os.release()
  },
  dataCallback: (data) => {
    const stderr = getLogCache(logLevel.ERROR)
    const stdout = getLogCache(logLevel.LOG)
    data.extra.logs = {
      [logLevel.LOG]: stdout,
      [logLevel.ERROR]: stderr
    }
    return data
  },
  autoBreadcrumbs: {
    console: true
  }
}

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
