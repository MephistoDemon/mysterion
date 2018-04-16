import Vue from 'vue'
import Injector from 'vue-inject'

/**
 * Creates new DI container
 *
 * @return {Object}
 */
function factory () {
  const container = Injector.spawn()
  Vue.use(container)

  return container
}

export default factory
