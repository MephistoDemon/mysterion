import vueBootstrap from './modules/vue'
import tequilapiBootstrap from './modules/tequilapi'
import applicationBootstrap from './modules/application'

/**
 * Bootstraps all application dependencies into DI container
 *
 * @param {Object} container
 */
function bootstrap (container) {
  vueBootstrap(container)
  tequilapiBootstrap(container)
  applicationBootstrap(container)
}

export default bootstrap
