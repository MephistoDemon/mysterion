/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
