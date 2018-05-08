// @flow
import * as bugReporter from '../../../app/bugReporting/bug-reporter-main'
import {install as feedbackFormInstall} from '../../../app/bugReporting/feedback-form'
import type {Container} from '../../../app/di/index'

function bootstrap (container: Container) {
  container.constant(
    'sentryURL',
    'https://f1e63dd563c34c35a56e98aa02518d40:0104611dab3d492eae3c28936c34505f@sentry.io/300978'
  )

  container.constant('bugReporter', bugReporter)
  container.constant('feedbackFormInstall', feedbackFormInstall)
}

export default bootstrap
