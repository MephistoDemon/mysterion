// @flow
import type {Container} from '../app/di'
import TequilApiFactory from '../libraries/api/client/factory'

function bootstrap (container: Container) {
  container.constant(
    'tequilapiFlow.config',
    {
      'baseURL': 'http://127.0.0.1:4050'
    }
  )
  container.service(
    'tequilapiFlow',
    ['tequilapiFlow.config'],
    (config: any) => {
      return new TequilApiFactory(config.baseURL)
    }
  )
}

export default bootstrap
