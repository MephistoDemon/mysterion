import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

Raven
  .config('https://1f0b7727aa3c4998b4073727ec3d21fe@sentry.io/290420')
  .addPlugin(RavenVue, Vue)
  .install()

window.addEventListener('unhandledrejection', (evt) => {
  Raven.captureException(evt.reason, {
    extra: evt.reason.response ? evt.reason.response.data : evt.reason
  })
})
