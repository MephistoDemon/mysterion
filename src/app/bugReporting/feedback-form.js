// @flow
import registerHeaderRules from '../window/requestHeaders'
import type {HeaderRule} from '../window/requestHeaders'

function configInstallerWithRules (requestHeaderRewriteRule: HeaderRule) {
  return function install (session: Object): void {
    registerHeaderRules(session, requestHeaderRewriteRule)
  }
}

class FeedbackForm {
  raven: Object

  constructor (raven: Object) {
    this.raven = raven
  }

  show () {
    this.raven.captureMessage('User opened issue report form.')
    this.raven.showReportDialog()
  }
}

export {configInstallerWithRules, FeedbackForm}
