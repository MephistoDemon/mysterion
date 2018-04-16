// @flow
import containerFactory from './dependencies/container'
import vueBootstrap from './dependencies/modules/vue'
import tequilapiBootstrap from './dependencies/modules/tequilapi'
import applicationBootstrap from './dependencies/modules/application'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap () {
  const container = containerFactory()
  vueBootstrap(container)
  tequilapiBootstrap(container)
  applicationBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
