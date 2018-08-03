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
import SystemMock from '../../../../helpers/system-mock'
import type { SystemMockManager } from '../../../../helpers/system-mock'
import type { System } from '../../../../../src/libraries/mysterium-client/system'
import type { ServiceState } from '../../../../../src/libraries/mysterium-client/service-manager/service-manager'
import ServiceManager, { SERVICE_STATE } from '../../../../../src/libraries/mysterium-client/service-manager/service-manager'

const SERVICE_MANAGER_PATH = '/service-manager/bin/servicemanager.exe'

const getServiceInfo = (state: ServiceState) =>
  `SERVICE_NAME: MysteriumClient
   STATE       : 0  ${state} \r\n`

const createSystemMock = () => {
  const systemMock = new SystemMock()
  systemMock.setMockCommand('sc.exe query "MysteriumClient"', getServiceInfo(SERVICE_STATE.RUNNING))
  systemMock.setMockCommand('/service-manager/bin/servicemanager.exe --do=start', getServiceInfo(SERVICE_STATE.START_PENDING))
  systemMock.setMockCommand('/service-manager/bin/servicemanager.exe --do=stop', getServiceInfo(SERVICE_STATE.STOP_PENDING))
  systemMock.setMockCommand('/service-manager/bin/servicemanager.exe --do=restart', getServiceInfo(SERVICE_STATE.START_PENDING))
  return systemMock
}

describe('ServiceManager', () => {
  let systemMockManager: SystemMockManager
  let system: System
  let serviceManager: ServiceManager

  const testCommand = async (command: () => Promise<ServiceState>, doCommand: string, resultState: ServiceState) => {
    const state = await command()
    expect(state).to.be.eql(resultState)
    expect(systemMockManager.sudoExecCalledCommands).to.have.length(1)
    expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql('/service-manager/bin/servicemanager.exe --do=' + doCommand)
  }

  beforeEach(() => {
    const systemMock = createSystemMock()
    system = (systemMock: System)
    systemMockManager = (systemMock: SystemMockManager)
    serviceManager = new ServiceManager(SERVICE_MANAGER_PATH, system)
  })

  describe('.install', () => {
    it('calls "servicemanager.exe install" with admin rights', async () => {
      await serviceManager.install()
      expect(systemMockManager.sudoExecCalledCommands).to.have.length(1)
      expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql(
        '/service-manager/bin/servicemanager.exe --do=install && /service-manager/bin/servicemanager.exe --do=start')
    })
  })

  describe('.start', () => {
    it('calls "servicemanager.exe start" with admin rights', async () => {
      await testCommand(serviceManager.start.bind(serviceManager), 'start', SERVICE_STATE.START_PENDING)
    })
  })

  describe('.stop', () => {
    it('calls "servicemanager.exe stop" with admin rights', async () => {
      await testCommand(serviceManager.stop.bind(serviceManager), 'stop', SERVICE_STATE.STOP_PENDING)
    })
  })

  describe('.restart', () => {
    it('calls "servicemanager.exe restart" with admin rights', async () => {
      await testCommand(serviceManager.restart.bind(serviceManager), 'restart', SERVICE_STATE.START_PENDING)
    })
  })

  describe('.getServiceState', async () => {
    it('calls "sc.exe query" to check service state', async () => {
      const state = await serviceManager.getServiceState()
      expect(state).to.be.eql(SERVICE_STATE.RUNNING)
      expect(systemMockManager.sudoExecCalledCommands).to.have.length(0)
      expect(systemMockManager.userExecCalledCommands).to.have.length(1)
      expect(systemMockManager.userExecCalledCommands[0]).to.be.eql('sc.exe query "MysteriumClient"')
    })

    it('returns unknown state when sc.exe gives unexpected results', async () => {
      systemMockManager.setMockCommand('sc.exe query "MysteriumClient"', 'SOME_RANDOM_WINDOWS_ERROR')
      const state = await serviceManager.getServiceState()
      expect(state).to.be.eql(SERVICE_STATE.UNKNOWN)
    })
  })
})
