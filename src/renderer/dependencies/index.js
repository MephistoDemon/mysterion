import dependencies from 'vue-inject'
import TequilAPI from '@/../libraries/api/tequilapi'

dependencies.constant(
  'tequilapi.config',
  {
    'baseURL': 'http://127.0.0.1:4050'
  }
)
dependencies.service(
  'tequilapi',
  ['tequilapi.config'],
  (config) => {
    return new TequilAPI(config.baseURL)
  }
)

export default dependencies
