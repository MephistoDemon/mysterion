// @flow
import registerHeaderRules from '../window/requestHeaders'
import type {HeaderRule} from '../window/requestHeaders'

const requestHeaderRewriteRule: HeaderRule = {
  urls: ['https://sentry.io/api/embed/error-page/*'],
  write: function (headers: Object): Object {
    headers['Referer'] = '*'
    return headers
  }
}

function install (session: Object): void {
  registerHeaderRules(session, requestHeaderRewriteRule)
}

function showReportDialog (raven: Object): void {
  raven.captureMessage('User opened issue report form.')
  raven.showReportDialog()
}

export {install, showReportDialog}
