// @flow
import type {Container} from '../app/di'
import TequilAPI from '../libraries/api/tequilapi'

function bootstrap (container: Container) {
  container.constant(
    'tequilapi.config',
    {
      'baseURL': 'http://127.0.0.1:4050'
    }
  )
  container.service(
    'tequilapi',
    ['tequilapi.config'],
    (config: any) => {
      return new TequilAPI(config.baseURL)
    }
  )
}

export default bootstrap
