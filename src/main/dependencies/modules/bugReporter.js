// @flow
import bugReporter from '../../../app/bugReporting/bug-reporter-main'
import type {Container} from '../../../app/di'

function bootstrap (container: Container) {
  container.constant(
    'sentryURL',
    'https://f1e63dd563c34c35a56e98aa02518d40:0104611dab3d492eae3c28936c34505f@sentry.io/300978'
  )

  container.service(
    'bugReporter',
    ['sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      bugReporter.install(sentryURL, config)
      return bugReporter
    }
  )
}

export default bootstrap
