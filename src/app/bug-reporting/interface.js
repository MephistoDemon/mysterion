// @flow

import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import {logLevels} from '../../libraries/mysterium-client'

export interface BugReporter {
  install (): void,
  setUser (IdentityDTO): void,
  captureException (Error): void,
  pushToLogCache (logLevels.LOG | logLevels.ERROR, string): void
}
