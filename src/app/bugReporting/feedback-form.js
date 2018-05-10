// @flow

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

export {FeedbackForm}
