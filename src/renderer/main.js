import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import bugReporter from '../main/bug-reporting'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')

let raven = bugReporter.installInRenderer(Vue)

window.addEventListener('unhandledrejection', (evt) => {
  raven.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})
