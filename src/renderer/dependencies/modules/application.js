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
import { Container } from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererIpc from '../../../app/communication/ipc/renderer-ipc'
import { remote } from 'electron'
import VpnInitializer from '../../../app/vpnInitializer'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import realSleep from '../../../libraries/sleep'
import IpcMessageBus from '../../../app/communication/ipc-message-bus'

function bootstrap (container: Container) {
  const mysterionReleaseID = remote.getGlobal('__mysterionReleaseID')
  container.constant('mysterionReleaseID', mysterionReleaseID)

  container.service(
    'rendererCommunication',
    ['bugReporterMetrics'],
    (bugReporterMetrics) => {
      const ipc = new RendererIpc()
      const messageBus = new IpcMessageBus(ipc)
      const communication = new RendererCommunication(messageBus)
      return communication
    }
  )

  container.service(
    'vpnInitializer',
    ['tequilapiClient'],
    (tequilapiClient: TequilapiClient) => new VpnInitializer(tequilapiClient)
  )

  container.service(
    'sleeper',
    [],
    () => {
      return {
        async sleep (time: number): Promise<void> {
          return realSleep(time)
        }
      }
    }
  )
}

export default bootstrap
