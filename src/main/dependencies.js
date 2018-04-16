// @flow
import type {Container} from '../app/di/container'
import JpexContainer from '../app/di/container'
import tequilapiBootstrap from '../dependencies/tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): Container {
  const container = new JpexContainer()
  tequilapiBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
