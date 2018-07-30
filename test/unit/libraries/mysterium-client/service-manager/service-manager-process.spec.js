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

import { beforeEach, describe, expect, it } from '../../../../helpers/dependencies'
import ServiceManagerProcess, { SERVICE_STATE } from '../../../../../src/libraries/mysterium-client/service-manager/service-manager-process'
import type { ServiceState } from '../../../../../src/libraries/mysterium-client/service-manager/service-manager-process'
import EmptyTequilapiClientMock from '../../../renderer/store/modules/empty-tequilapi-client-mock'
import SystemMock from '../../../../helpers/system-mock'
import type { NodeHealthcheckDTO } from '../../../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'
import NodeBuildInfoDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-build-info'
import ClientLogSubscriber from '../../../../../src/libraries/mysterium-client/client-log-subscriber'
import type { LogCallback } from '../../../../../src/libraries/mysterium-client'
import type { SystemMockManager } from '../../../../helpers/system-mock'
import type { System } from '../../../../../src/libraries/mysterium-client/system'

const SERVICE_MANAGER_DIR = '/service-manager/bin/'

const getServiceInfo = (state: ServiceState) =>
  `SERVICE_NAME: MysteriumClient
   STATE       : 0  ${state} \r\n`

const createSystemMock = () => {
  const systemMock = new SystemMock()
  systemMock.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))
  systemMock.setMockCommand('/service-manager/bin/servicemanager.exe --do=start', getServiceInfo(SERVICE_STATE.START_PENDING))
  systemMock.setMockCommand('/service-manager/bin/servicemanager.exe --do=restart', getServiceInfo(SERVICE_STATE.START_PENDING))
  return systemMock
}

class TequilapiMock extends EmptyTequilapiClientMock {
  cancelIsCalled: boolean = false
  healthCheckThrowsError: boolean = false
  healthCheckIsCalled: boolean = false

  async connectionCancel (): Promise<void> {
    this.cancelIsCalled = true
  }

  async healthCheck (_timeout: ?number): Promise<NodeHealthcheckDTO> {
    this.healthCheckIsCalled = true
    if (this.healthCheckThrowsError) {
      throw new Error('HEALTHCHECK_TEST_ERROR')
    }
    return {
      uptime: '',
      process: 0,
      version: '',
      buildInfo: new NodeBuildInfoDTO({})
    }
  }
}

class ClientLogSubscriberMock extends ClientLogSubscriber {
  constructor () {
    super('', '', '', () => new Date(), (filePath: string, logCallback: LogCallback) => {})
  }

  async setup (): Promise<void> {}

  onLog (level: string, cb: LogCallback): void {}

  async _prepareLogFiles (): Promise<void> {}
}

describe('ServiceManagerProcess', () => {
  let systemMockManager: SystemMockManager
  let system: System
  let tequilapiClient: TequilapiMock
  let process: ServiceManagerProcess
  let clientLogSubscriber: ClientLogSubscriberMock

  beforeEach(() => {
    const systemMock = createSystemMock()
    system = (systemMock: System)
    systemMockManager = (systemMock: SystemMockManager)

    tequilapiClient = new TequilapiMock()
    clientLogSubscriber = new ClientLogSubscriberMock()
    process = new ServiceManagerProcess(tequilapiClient, clientLogSubscriber, SERVICE_MANAGER_DIR, system)
  })

  describe('.start()', () => {
    it('does nothing with started service at first call', async () => {
      await process.start()
      expect(systemMockManager.sudoExecCalledCommands).to.have.length(0)
    })

    it('restart started service at second call', async () => {
      // first call does nothing
      await process.start()

      // second call must restart service
      const startPromise = process.start()
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))
      await startPromise

      expect(systemMockManager.sudoExecCalledCommands).to.have.length(1)
      expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql('/service-manager/bin/servicemanager.exe --do=restart')
    })

    it('starts stopped service', async () => {
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.STOPPED))

      const startPromise = process.start()
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))
      await startPromise

      expect(systemMockManager.sudoExecCalledCommands).to.have.length(1)
      expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql('/service-manager/bin/servicemanager.exe --do=start')
    })

    it('starts stopped service once', async () => {
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.STOPPED))

      const startPromise = process.start()
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))

      // those calls should be ignored until first "start" call is running
      await process.start()
      await process.start()
      await process.start()
      await process.start()

      // wait until first "start" call ends
      await startPromise

      expect(systemMockManager.sudoExecCalledCommands).to.have.length(1)
      expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql('/service-manager/bin/servicemanager.exe --do=start')
    })

    it('waits for healthcheck after service restart', async () => {
      tequilapiClient.healthCheckThrowsError = true

      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.STOPPED))

      // second call must restart service
      let startExecuted = false
      const startPromise = process.start().then(() => {
        startExecuted = true
      })
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))

      expect(startExecuted).to.be.false

      tequilapiClient.healthCheckThrowsError = false
      await startPromise

      expect(tequilapiClient.healthCheckIsCalled).to.be.true
      expect(startExecuted).to.be.true
    })
  })

  describe('.stop()', () => {
    it('cancels tequilapi connection', async () => {
      await process.stop()
      expect(systemMockManager.sudoExecCalledCommands).to.have.length(0)
      expect(tequilapiClient.cancelIsCalled).to.be.true
    })
  })
})
