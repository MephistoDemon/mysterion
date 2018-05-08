// @flow
import RavenJs from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'
import {pushToLogCache} from './logsCache'
import config from './config'

function install (url: string, vue: Object, releaseId: string) {
  RavenJs.config(url, {...config, release: releaseId}).install().addPlugin(RavenVue, vue)
}

function getRavenInstance (): Object {
  return RavenJs
}

function setUser (userData) {
  RavenJs.setUserContext(userData)
}
const captureException = RavenJs.captureException.bind(RavenJs)

export {
  install,
  setUser,
  pushToLogCache,
  getRavenInstance,
  captureException
}
