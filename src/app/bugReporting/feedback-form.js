// @flow
import registerHeaderRules from '../rendererRequestHeaders'
import type {HeaderRule} from '../rendererRequestHeaders'

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
