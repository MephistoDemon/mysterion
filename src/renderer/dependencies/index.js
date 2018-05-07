// @flow
import Vue from 'vue'
import DIContainer from '../../app/di/vue-container'
import bugReporterBootstrap from './modules/bugReporter'
import vueBootstrap from './modules/vue'
import tequilapiBootstrap from '../../dependencies/tequilapi'
import applicationBootstrap from './modules/application'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer(Vue)
  bugReporterBootstrap(container)
  vueBootstrap(container)
  tequilapiBootstrap(container)
  applicationBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
