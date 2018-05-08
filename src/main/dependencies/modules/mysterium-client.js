// @flow
import type {Container} from '../../../app/di'
import ClientConfig from '../../../libraries/mysterium-client/config'
import type {MysterionConfig} from '../../../app/mysterionConfig'
import {Installer, Process, Monitoring} from '../../../libraries/mysterium-client'
import path from 'path'

function bootstrap (container: Container) {
  container.service(
    'mysteriumClient.config',
    ['mysterionApplication.config'],
    (mysterionConfig: MysterionConfig) => {
      return new ClientConfig(
        path.join(mysterionConfig.contentsDirectory, 'bin', 'mysterium_client'),
        path.join(mysterionConfig.contentsDirectory, 'bin', 'config'),
        path.join(mysterionConfig.contentsDirectory, 'bin', 'openvpn'),
        mysterionConfig.userDataDirectory,
        mysterionConfig.runtimeDirectory,
        mysterionConfig.userDataDirectory
      )
    }
  )
  container.service(
    'mysteriumClientInstaller',
    ['mysteriumClient.config'],
    (config) => {
      return new Installer(config)
    }
  )
  container.service(
    'mysteriumClientProcess',
    ['tequilapiClient', 'mysteriumClient.config'],
    (tequilapiClient, mysteriumClientConfig) => {
      return new Process(tequilapiClient, mysteriumClientConfig.dataDir)
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
