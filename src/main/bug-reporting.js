import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'

const logsBuffer = []
const maxLength = 300

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
    data.extra.logs = logsBuffer.reverse()
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

const pushToLogCache = (data) => {
  if (logsBuffer.length >= maxLength) {
    logsBuffer.splice(0, logsBuffer.length - maxLength)
  }
  logsBuffer.push(data)
}

export default {
  renderer: {
    install: installInRenderer,
    captureException: RavenJs.captureException.bind(RavenJs),
    RavenJs
  },
  main: {
    install: installInMain,
    captureException: Raven.captureException.bind(Raven),
    Raven
  },
  setUser,
  pushToLogCache
}
