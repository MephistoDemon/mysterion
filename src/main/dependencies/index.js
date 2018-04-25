// @flow
import DIContainer from '../../app/di/jpex-container'
import tequilapiBootstrap from '../../dependencies/tequilapi'
import tequilapiFlowBootstrap from '../../dependencies/tequilapi-flow'
import applicationBootstrap from './modules/application'
import proposalFetcherBootstrap from './modules/proposal-fetcher'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  tequilapiBootstrap(container)
  tequilapiFlowBootstrap(container)
  proposalFetcherBootstrap(container)
  applicationBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
