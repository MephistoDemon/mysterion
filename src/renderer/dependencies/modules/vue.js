import Vue from 'vue'
import axios from 'axios'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import App from '../../App'
import storeFactory from '../../store/factory'
import routerFactory from '../../router/factory'

function bootstrap (container) {
  container.service(
    'vue-application',
    [],
    () => {
      if (!process.env.IS_WEB) {
        Vue.use(require('vue-electron'))
      }
      Vue.http = Vue.prototype.$http = axios
      Vue.config.productionTip = false

      return new Vue({
        components: {App},
        router: container.get('vue-router'),
        store: container.get('vue-store'),
        template: '<App/>',
        el: '#app'
      })
    }
  )

  container.service(
    'vue-store',
    ['tequilapi'],
    (tequilapi) => {
      const rendererMessageBus = new RendererMessageBus()
      const rendererCommunication = new RendererCommunication(rendererMessageBus)

      return storeFactory(tequilapi, rendererCommunication)
    }
  )

  container.service(
    'vue-router',
    ['vue-store'],
    (store) => {
      return routerFactory(store)
    }
  )
}

export default bootstrap
