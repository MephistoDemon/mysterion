// @flow
// import RavenJs from 'raven'
import registerHeaderRules from '../rendererRequestHeaders'
import type HeaderRule from '../rendererRequestHeaders'

const rules: Array<HeaderRule> = [
  {
    urls: ['https://sentry.io/api/embed/error-page/*'],
    write: function (headers) {
      headers['Referer'] = '*'
      return headers
    }
  }
]

function install (session): void {
  registerHeaderRules(session, rules)
}

function showReportDialog (raven): void {
  raven.captureMessage('User opened issue report form.')
  raven.showReportDialog()
}

export { install, showReportDialog }
