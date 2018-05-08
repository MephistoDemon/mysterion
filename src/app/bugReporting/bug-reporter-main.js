// @flow
import Raven from 'raven'
import config from './config'
import {pushToLogCache} from './logsCache'

import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'

function install (url: string, releaseId: string) {
  Raven.config(url, {...config, release: releaseId}).install()
}

function setUser (userData: IdentityDTO) {
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
