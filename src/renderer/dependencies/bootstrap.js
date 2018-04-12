import vueBootstrap from './modules/vue'
import tequilapiBootstrap from './modules/tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 *
 * @param {Object} container
 */
function bootstrap (container) {
  vueBootstrap(container)
  tequilapiBootstrap(container)
}

export default bootstrap
