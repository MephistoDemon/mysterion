// @flow
import DIContainer from '../../app/di/jpex-container'
import applicationBootstrap from './modules/application'
import bugReportingConfigBootstrap from '../../dependencies/bug-reporting'
import bugReportingBootstrap from './modules/bug-reporting'
import mysteriumClientBootstrap from './modules/mysterium-client'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'
import proposalFetcherBootstrap from './modules/proposal-fetcher'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  applicationBootstrap(container)
  bugReportingConfigBootstrap(container)
  bugReportingBootstrap(container)
  mysteriumClientBootstrap(container)
  mysteriumTequilapiBootstrap(container)
  proposalFetcherBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
