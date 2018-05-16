// @flow
import type {Container} from '../../../app/di'
import type {MysterionConfig} from '../../../app/mysterionConfig'
import {Installer, Process, Monitoring} from '../../../libraries/mysterium-client'
import path from 'path'
import type {ClientConfig} from '../../../libraries/mysterium-client/config'

function bootstrap (container: Container) {
  container.service(
    'mysteriumClient.config',
    ['mysterionApplication.config'],
    (mysterionConfig: MysterionConfig): ClientConfig => {
      return {
        clientBin: path.join(mysterionConfig.contentsDirectory, 'bin', 'mysterium_client'),
        configDir: path.join(mysterionConfig.contentsDirectory, 'bin', 'config'),
        openVPNBin: path.join(mysterionConfig.contentsDirectory, 'bin', 'openvpn'),
        dataDir: mysterionConfig.userDataDirectory,
        runtimeDir: mysterionConfig.runtimeDirectory,
        logDir: mysterionConfig.userDataDirectory,
        tequilapiPort: 4050
      }
    }
  )
  container.service(
    'mysteriumClientInstaller',
    ['mysteriumClient.config'],
    (config) => new Installer(config)
  )
  container.service(
    'mysteriumClientProcess',
    ['tequilapiClient', 'mysteriumClient.config'],
    (tequilapiClient, mysteriumClientConfig) => new Process(tequilapiClient, mysteriumClientConfig.dataDir)
  )
  container.service(
    'mysteriumClientMonitoring',
    ['tequilapiClient'],
    (tequilapiClient) => new Monitoring(tequilapiClient)
  )
}

export default bootstrap
