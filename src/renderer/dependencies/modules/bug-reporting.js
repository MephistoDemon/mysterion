// @flow
import type {Container} from '../../../app/di'
import bugReporter from '../../../app/bug-reporting/bug-reporter-renderer'
import {FeedbackForm} from '../../../app/bug-reporting/feedback-form'

function bootstrap (container: Container) {
  container.constant('bugReporter.sentryURL', 'https://f1e63dd563c34c35a56e98aa02518d40@sentry.io/300978')

  container.service(
    'bugReporter',
    ['bugReporter.sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      bugReporter.install(sentryURL, config)
      return bugReporter
    }
  )

  container.constant('raven', bugReporter.getRavenInstance())

  container.service(
    'feedbackForm',
    ['raven'],
    (raven) => {
      return new FeedbackForm(raven)
    })
}

export default bootstrap
