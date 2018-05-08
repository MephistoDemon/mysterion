// @flow
import type {Container} from '../app/di'
import tequilapiClientFactory from '../libraries/mysterium-tequilapi/client-factory'

function bootstrap (container: Container) {
  container.constant(
    'tequilapiClient.config',
    {
      'baseURL': 'http://127.0.0.1:4050'
    }
  )
  container.service(
    'tequilapiClient',
    ['tequilapiClient.config'],
    (config: Object) => {
      return tequilapiClientFactory(config.baseURL)
    }
  )
}

export default bootstrap
