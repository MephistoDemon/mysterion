// @flow
import type {Container} from '../../../app/di'
import BugReporterRenderer from '../../../app/bug-reporting/bug-reporter-renderer'
import {FeedbackForm} from '../../../app/bug-reporting/feedback-form'
import RavenJs from 'raven-js'
import Vue from 'vue'
import RavenVue from 'raven-js/plugins/vue'

function bootstrap (container: Container) {
  container.constant('bugReporter.sentryURL', 'https://f1e63dd563c34c35a56e98aa02518d40@sentry.io/300978')

  container.factory(
    'bugReporter',
    ['bugReporter.raven'],
    (raven) => new BugReporterRenderer(raven)
  )

  container.service(
    'bugReporter.raven',
    ['bugReporter.sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      return RavenJs
        .config(sentryURL, config)
        .install()
        .addPlugin(RavenVue, Vue)
    }
  )

  container.service(
    'feedbackForm',
    ['bugReporter.raven'],
    (raven) => new FeedbackForm(raven))
}

export default bootstrap
