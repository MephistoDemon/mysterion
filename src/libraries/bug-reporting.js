import os from 'os'
import Raven from 'raven'
import RavenJs from 'raven-js'
import {remote} from 'electron'

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

let install = (processType) => {
  let [url, raven] = []
  if (processType === 'main') {
    url = process.env.SENTRY.privateURL
    raven = Raven
  } else {
    url = remote.getGlobal('__sentryURL')
    raven = RavenJs
  }
  raven.config(url, config).install()
  return raven
}

export default {install}
