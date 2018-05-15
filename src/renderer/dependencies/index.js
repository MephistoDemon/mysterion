// @flow
import Vue from 'vue'
import DIContainer from '../../app/di/vue-container'
import bugReportingConfigBootstrap from '../../dependencies/bug-reporting'
import bugReportingBootstrap from './modules/bug-reporting'
import vueBootstrap from './modules/vue'
import applicationBootstrap from './modules/application'
import mysteriumTequilapiBootstrap from '../../dependencies/mysterium-tequilapi'

/**
 * Bootstraps all application dependencies into DI container
 */
function bootstrap (): DIContainer {
  const container = new DIContainer(Vue)
  bugReportingConfigBootstrap(container)
  bugReportingBootstrap(container)
  vueBootstrap(container)
  applicationBootstrap(container)
  mysteriumTequilapiBootstrap(container)

  return container
}

export {bootstrap}
export default bootstrap()
