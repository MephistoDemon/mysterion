// @flow
import type {Container} from '../../../app/di'
import BugReporterRenderer, {getRavenInstance} from '../../../app/bug-reporting/bug-reporter-renderer'
import {FeedbackForm} from '../../../app/bug-reporting/feedback-form'

function bootstrap (container: Container) {
  container.constant('bugReporter.sentryURL', 'https://f1e63dd563c34c35a56e98aa02518d40@sentry.io/300978')

  const bugReporterInstallOnce = true
  container.factory(
    'bugReporter',
    ['bugReporter.sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      const bugReporter = new BugReporterRenderer()
      bugReporter.install(sentryURL, config)
      return bugReporter
    }, bugReporterInstallOnce
  )

  container.constant('raven', getRavenInstance())

  container.service(
    'feedbackForm',
    ['raven'],
    (raven) => {
      return new FeedbackForm(raven)
    })
}

export default bootstrap
