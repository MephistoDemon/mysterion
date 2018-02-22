import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'
import RavenVue from 'raven-js/plugins/vue'

const config = {
  captureUnhandledRejections: true,
  release: global.__version,
  tags: {
    environment: process.env.NODE_ENV,
    process: process.type,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    platform: os.platform(),
    platform_release: os.release()
  }
}

let installInMain = () => {
  const url = process.env.SENTRY.privateURL
  Raven.config(url, config).install()
  return Raven
}

let installInRenderer = (Vue) => {
  const url = remote.getGlobal('__sentryURL')
  RavenJs.config(url, config).install().addPlugin(RavenVue, Vue)
  return RavenJs
}

export default {installInMain, installInRenderer}
