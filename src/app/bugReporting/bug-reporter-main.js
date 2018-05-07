// @flow
import Raven from 'raven'
import config from './config'
import {pushToLogCache} from './logsCache'

function install (url: string, releaseId: string) {
  config.release = releaseId
  Raven.config(url, config).install()
}

function setUser (userData: any) {
  Raven.setContext({
    user: userData
  })
}
const captureException = Raven.captureException.bind(Raven)

export {
  install,
  setUser,
  pushToLogCache,
  captureException
}
