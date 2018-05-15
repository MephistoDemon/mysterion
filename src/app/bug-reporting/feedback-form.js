// @flow
import RavenJs from 'raven-js'

class FeedbackForm {
  raven: Object

  constructor (raven: RavenJs) {
    this.raven = raven
  }

  show () {
    this.raven.captureMessage('User opened issue report form.')
    this.raven.showReportDialog()
  }
}

export {FeedbackForm}
