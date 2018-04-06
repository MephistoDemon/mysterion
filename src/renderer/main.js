import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import dependencies from './dependencies'

import bugReporter from '../app/bugReporting/bug-reporting'
import RendererCommunication from '../app/communication/renderer-communication'
import RendererMessageBus from '../app/communication/rendererMessageBus'
bugReporter.renderer.install(Vue)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(dependencies)

new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')

window.addEventListener('unhandledrejection', (evt) => {
  bugReporter.renderer.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})

const rendererMessageBus = new RendererMessageBus()

const rendererCommunication = new RendererCommunication(rendererMessageBus)
rendererCommunication.onMysteriumClientLog(({ level, data }) => {
  bugReporter.pushToLogCache(level, data)
})
