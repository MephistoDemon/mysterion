// @flow
import DIContainer from '../../app/di/jpex-container'
import tequilapiBootstrap from '../../dependencies/tequilapi'
import applicationBootstrap from './modules/application'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  tequilapiBootstrap(container)
  applicationBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
