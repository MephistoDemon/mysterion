// @flow
import type {Container} from '../../../app/di'
import {Installer, Process, Monitoring} from '../../../libraries/mysterium-client'

function bootstrap (container: Container) {
  container.service(
    'mysteriumClientInstaller',
    ['mysterionApplication.config'],
    (mysterionConfig) => {
      return new Installer(mysterionConfig)
    }
  )
  container.service(
    'mysteriumClientProcess',
    ['tequilapiClient', 'mysterionApplication.config'],
    (tequilapiClient, mysterionConfig) => {
      return new Process(tequilapiClient, mysterionConfig.userDataDirectory)
    }
  )
  container.service(
    'mysteriumClientMonitoring',
    ['tequilapiClient'],
    (tequilapiClient) => {
      return new Monitoring(tequilapiClient)
    }
  )
}

export default bootstrap
