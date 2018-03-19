import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'
import {logLevel} from '../libraries/mysterium-client'

const logsBuffer = { [logLevel.LOG]: [], [logLevel.ERROR]: [] }
const maxLogBufferLength = 300

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
    // sentry trims big data, so we reverse array to have latest on top
    data.extra.logs = {
      [logLevel.LOG]: logsBuffer[logLevel.LOG].reverse(),
      [logLevel.ERROR]: logsBuffer[logLevel.ERROR].reverse()
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
  if (logsBuffer[level].length >= maxLogBufferLength) {
    logsBuffer[level].shift()
  }
  logsBuffer[level].push(data)
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
