import tequilapiBootstrap from './modules/tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 *
 * @param {Object} container
 */
function bootstrap (container) {
  tequilapiBootstrap(container)
}

export default bootstrap
