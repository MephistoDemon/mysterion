// @flow
import BugReporterMain from '../../../app/bug-reporting/bug-reporter-main'
import type {Container} from '../../../app/di'

function bootstrap (container: Container) {
  container.constant(
    'bugReporter.sentryURL',
    'https://f1e63dd563c34c35a56e98aa02518d40:0104611dab3d492eae3c28936c34505f@sentry.io/300978'
  )

  const bugReporterInstallOnce = true
  container.factory(
    'bugReporter',
    ['bugReporter.sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      const bugReporter = new BugReporterMain(sentryURL, config)
      bugReporter.install()
      return bugReporter
    }, bugReporterInstallOnce
  )

  container.constant(
    'feedbackForm.headerRule',
    {
      urls: ['https://sentry.io/api/embed/error-page/*'],
      write: function (headers: Object): Object {
        headers['Referer'] = '*'
        return headers
      }
    }
  )
}

export default bootstrap
