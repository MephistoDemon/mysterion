import store from '../../store'
import routerFactory from '../../router/factory'

function bootstrap (container) {
  container.service(
    'vue-router',
    () => {
      return routerFactory(store)
    }
  )
}

export default bootstrap
