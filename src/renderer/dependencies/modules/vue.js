import storeFactory from '../../store/factory'
import routerFactory from '../../router/factory'

function bootstrap (container) {
  container.service(
    'vue-store',
    ['tequilapi'],
    (tequilapi) => {
      return storeFactory(tequilapi)
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
