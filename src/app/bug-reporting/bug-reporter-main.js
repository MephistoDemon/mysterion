// @flow
import Raven from 'raven'
import {pushToLogCache} from './logsCache'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'

function install (url: string, config: Object) {
  Raven.config(url, config).install()
}

function setUser (userData: IdentityDTO) {
  Raven.setContext({
    user: userData
  })
}
const captureException = Raven.captureException.bind(Raven)

export default {
  install,
  setUser,
  pushToLogCache,
  captureException
}
