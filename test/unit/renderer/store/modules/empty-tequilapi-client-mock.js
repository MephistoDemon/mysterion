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
import ConnectionIPDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-ip'
import ConnectionStatusDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-status'
import ConnectionStatisticsDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-statistics'
import type {TequilapiClient} from '../../../../../src/libraries/mysterium-tequilapi/client'
import IdentityDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/identity'
import ProposalsFilter from '../../../../../src/libraries/mysterium-tequilapi/dto/proposals-filter'
import ProposalDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/proposal'
import ConsumerLocationDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/consumer-location'
import type { NodeHealthcheckDTO } from '../../../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'
import NodeBuildInfoDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-build-info'

class EmptyTequilapiClientMock implements TequilapiClient {
  async healthCheck (_timeout: ?number): Promise<NodeHealthcheckDTO> {
    return {
      uptime: '',
      process: 0,
      version: '',
      buildInfo: new NodeBuildInfoDTO({})
    }
  }

  async stop (): Promise<void> {
  }

  async identitiesList (): Promise<Array<IdentityDTO>> {
    return []
  }

  async identityCreate (passphrase: string): Promise<IdentityDTO> {
    return new IdentityDTO({})
  }

  async identityUnlock (id: string, passphrase: string): Promise<void> {
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    return []
  }

  async connectionCreate (): Promise<ConnectionStatusDTO> {
    return new ConnectionStatusDTO({})
  }

  async connectionStatus (): Promise<ConnectionStatusDTO> {
    return new ConnectionStatusDTO({})
  }

  async connectionCancel (): Promise<void> {
  }

  async connectionIP (): Promise<ConnectionIPDTO> {
    return new ConnectionIPDTO({})
  }

  async connectionStatistics (): Promise<ConnectionStatisticsDTO> {
    return new ConnectionStatisticsDTO({})
  }

  async location (): Promise<ConsumerLocationDTO> {
    return new ConsumerLocationDTO({})
  }
}

export default EmptyTequilapiClientMock
