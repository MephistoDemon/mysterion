// @flow
import type {Container} from '../app/di'
import tequilapiClientFactory from '../libraries/mysterium-tequilapi/client-factory'

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
      return tequilapiClientFactory(config.baseURL)
    }
  )
}

export default bootstrap
