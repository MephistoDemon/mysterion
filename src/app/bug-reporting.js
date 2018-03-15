import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import LimitedList from '../libraries/limited-linked-list'
import {logLevel} from '../libraries/mysterium-client/index'

const logsBuffer = {
  [logLevel.LOG]: new LimitedList(300),
  [logLevel.ERROR]: new LimitedList(300)
}

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
    const stderr = logsBuffer[logLevel.ERROR].toArray().reverse().join('\n')
    const stdout = logsBuffer[logLevel.LOG].toArray().reverse().join('\n')
    data.extra.logs = {
      [logLevel.LOG]: stdout,
      [logLevel.ERROR]: stderr
    }
    return data
  }
}

const installInMain = () => {
  config.release = global.__version
  const url = process.env.SENTRY.privateURL
  Raven.config(url, config).install()
  return Raven
}

const installInRenderer = (Vue) => {
  config.release = remote.getGlobal('__version')
  const url = remote.getGlobal('__sentryURL')
  RavenJs.config(url, config).install().addPlugin(RavenVue, Vue)
  return RavenJs
}

const setUser = (userData) => {
  RavenJs.setUserContext(userData)
  Raven.setContext({
    user: userData
  })
}

const pushToLogCache = (level, data) => {
  logsBuffer[level].insert(data)
}

export default {
  renderer: {
    install: installInRenderer,
    captureException: RavenJs.captureException.bind(RavenJs),
    raven: RavenJs
  },
  main: {
    install: installInMain,
    captureException: Raven.captureException.bind(Raven),
    raven: Raven
  },
  setUser,
  pushToLogCache
}
