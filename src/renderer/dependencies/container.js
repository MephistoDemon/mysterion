import Injector from 'vue-inject'

/**
 * Creates new DI container
 *
 * @return {Object}
 */
function factory () {
  return Injector.spawn()
}

export default factory
