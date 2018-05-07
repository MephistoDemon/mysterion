// @flow
import DIContainer from '../../app/di/jpex-container'
import applicationBootstrap from './modules/application'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'
import proposalFetcherBootstrap from './modules/proposal-fetcher'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  applicationBootstrap(container)
  mysteriumTequilapiBootstrap(container)
  proposalFetcherBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
