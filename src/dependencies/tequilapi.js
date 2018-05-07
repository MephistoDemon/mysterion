// @flow
import type {Container} from '../app/di'
import TequilAPI from '../libraries/api/tequilapi'
import tequilapiFactory from '../libraries/api/client/factory'

function bootstrap (container: Container) {
  container.constant(
    'tequilapi.config',
    {
      'baseURL': 'http://127.0.0.1:4050'
    }
  )
  container.service(
    'tequilapiDepreciated',
    ['tequilapi.config'],
    (config: any) => {
      return new TequilAPI(config.baseURL)
    }
  )
  container.service(
    'tequilapi',
    ['tequilapi.config'],
    (config: any) => {
      return tequilapiFactory(config.baseURL)
    }
  )
}

export default bootstrap
