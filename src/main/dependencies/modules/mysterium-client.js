// @flow
import type {Container} from '../../../app/di'
import mysterionConfig from '../../../app/mysterion-config'
import {Installer, Process, Monitoring} from '../../../libraries/mysterium-client'

function bootstrap (container: Container) {
  container.service(
    'mysteriumClientInstaller',
    [],
    () => {
      return new Installer(mysterionConfig)
    }
  )
  container.service(
    'mysteriumClientProcess',
    ['tequilapiClient'],
    (tequilapiClient) => {
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
