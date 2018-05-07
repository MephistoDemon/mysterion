// @flow
import type {Container} from '../../../app/di'
import * as bugReporter from '../../../app/bugReporting/bug-reporter-renderer'

function bootstrap (container: Container) {
  container.constant('sentryURL', 'https://f1e63dd563c34c35a56e98aa02518d40@sentry.io/300978')

  container.constant('bugReporter', bugReporter)
}

export default bootstrap
