// @flow

import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import {logLevel} from '../../libraries/mysterium-client'

export interface BugReporter {
  install (): void,
  setUser (IdentityDTO): void,
  captureException (Error): void,
  pushToLogCache (logLevel.LOG | logLevel.ERROR, string): void
}
