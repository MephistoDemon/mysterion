// @flow
import DIContainer from '../../app/di/jpex-container'
import bugReporterBootstrap from './modules/bugReporter'
import tequilapiBootstrap from '../../dependencies/tequilapi'
import applicationBootstrap from './modules/application'
import proposalFetcherBootstrap from './modules/proposal-fetcher'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  bugReporterBootstrap(container)
  tequilapiBootstrap(container)
  proposalFetcherBootstrap(container)
  applicationBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
