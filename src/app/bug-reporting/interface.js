// @flow

import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import {logLevels} from '../../libraries/mysterium-client'

export interface BugReporter {
  setUser (IdentityDTO): void,
  captureMessage (message: string, context: ?any): void,
  captureException (err: Error, context: ?any): void,
  pushToLogCache (logLevels.LOG | logLevels.ERROR, string): void
}
