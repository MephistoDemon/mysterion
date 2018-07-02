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
import type { Container } from '../../../app/di'
import type { MysterionConfig } from '../../../app/mysterionConfig'
import { Monitoring } from '../../../libraries/mysterium-client'

import LaunchDaemonInstaller from '../../../libraries/mysterium-client/launch-daemon/installer'
import LaunchDaemonProcess from '../../../libraries/mysterium-client/launch-daemon/process'

import StandaloneInstaller from '../../../libraries/mysterium-client/standalone/installer'
import StandaloneProcess from '../../../libraries/mysterium-client/standalone/process'

import path from 'path'
import type { ClientConfig } from '../../../libraries/mysterium-client/config'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import { LAUNCH_DAEMON_PORT } from '../../../libraries/mysterium-client/launch-daemon/config'
import os from 'os'

function bootstrap (container: Container) {
  container.service(
    'mysteriumClient.platform',
    [],
    () => {
      return os.platform()
    }
  )
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
    ['mysteriumClient.config', 'mysteriumClient.platform'],
    (config: ClientConfig, platform: string) => {
      switch (platform) {
        case 'darwin':
          return new LaunchDaemonInstaller(config)
        default:
          return new StandaloneInstaller()
      }
    }
  )
  container.service(
    'mysteriumClientProcess',
    ['tequilapiClient', 'mysteriumClient.config', 'mysteriumClient.platform'],
    (tequilapiClient: TequilapiClient, config: ClientConfig, platform: string) => {
      switch (platform) {
        case 'darwin':
          return new LaunchDaemonProcess(tequilapiClient, LAUNCH_DAEMON_PORT, config.logDir)
        default:
          return new StandaloneProcess(config)
      }
    }
  )
  container.service(
    'mysteriumClientMonitoring',
    ['tequilapiClient'],
    (tequilapiClient) => new Monitoring(tequilapiClient)
  )
}

export default bootstrap
