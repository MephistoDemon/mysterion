// @flow
import Vue from 'vue'
import DIContainer from '../../app/di/vue-container'
import vueBootstrap from './modules/vue'
import applicationBootstrap from './modules/application'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer(Vue)
  vueBootstrap(container)
  applicationBootstrap(container)
  mysteriumTequilapiBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
