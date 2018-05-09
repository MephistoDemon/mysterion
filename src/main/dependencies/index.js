// @flow
import DIContainer from '../../app/di/jpex-container'
import applicationBootstrap from './modules/application'
import bugReporterConfigBootstrap from '../../dependencies/bugReporterConfig'
import bugReporterBootstrap from './modules/bugReporter'
import feedbackFormBootstrap from './modules/feedback-form'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'
import proposalFetcherBootstrap from './modules/proposal-fetcher'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  applicationBootstrap(container)
  bugReporterConfigBootstrap(container)
  bugReporterBootstrap(container)
  feedbackFormBootstrap(container)
  mysteriumTequilapiBootstrap(container)
  proposalFetcherBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
