// @flow
import DIContainer from '../app/di/jpex-container'
import tequilapiBootstrap from '../dependencies/tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer()
  tequilapiBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
