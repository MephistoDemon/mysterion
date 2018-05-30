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
import {Container} from '../../../app/di'
import RendererCommunication from '../../../app/communication/renderer-communication'
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import ElkCollector from '../../../app/statistics/elk-collector'
import AggregatingCollector from '../../../app/statistics/aggregating-collector'
import NullCollector from '../../../app/statistics/null-collector'
import {remote} from 'electron'
import type {ApplicationInfo} from '../../../app/statistics/events'
import {createEventFactory} from '../../../app/statistics/events'
import VpnInitializer from '../../../app/vpnInitializer'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import realSleep from '../../../libraries/sleep'

function bootstrap (container: Container) {
  const mysterionReleaseID = remote.getGlobal('__mysterionReleaseID')
  container.constant('mysterionReleaseID', mysterionReleaseID)

  container.service(
    'rendererCommunication',
    [],
    () => {
      return new RendererCommunication(new RendererMessageBus())
    }
  )

  container.constant(
    'statsApplicationInfo',
    {
      name: 'mysterion_application',
      version: mysterionReleaseID
    }
  )
  container.service(
    'statsEventFactory',
    ['statsApplicationInfo'],
    (applicationInfo: ApplicationInfo) => {
      return createEventFactory(applicationInfo)
    }
  )
  container.service(
    'statsCollector',
    [],
    () => {
      if (process.env.NODE_ENV === 'production') {
        const elkCollector = new ElkCollector('http://metrics.mysterium.network:8091')
        return new AggregatingCollector(elkCollector, 10)
      }

      return new NullCollector()
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
