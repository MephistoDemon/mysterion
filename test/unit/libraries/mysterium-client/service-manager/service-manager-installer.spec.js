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
import ServiceManagerInstaller
  from '../../../../../src/libraries/mysterium-client/service-manager/service-manager-installer'
import SystemMock from '../../../../helpers/system-mock'
import type { SystemMockManager } from '../../../../helpers/system-mock'
import type { System } from '../../../../../src/libraries/mysterium-client/system'

const STRINGIFIED_CONFIG = JSON.stringify({
  Name: 'MysteriumClient',
  DisplayName: 'Mysterium Client',
  Description: 'Mysterium Client service',
  Directory: '/tmp/runtime',
  Executable: '/tmp/clientbin',
  Port: 4050,
  Arguments: [
    '--config-dir=/tmp/config',
    '--data-dir=/tmp/data',
    '--runtime-dir=/tmp/runtime',
    '--openvpn.binary=/tmp/ovpnbin',
    '--tequilapi.port=4050'
  ],
  Logging: {
    Stderr: '/tmp/logs/stderr.log',
    Stdout: '/tmp/logs/stdout.log'
  }
})

const SERVICE_MANAGER_DIR = '/service-manager/bin/'
const CONFIG_FILE = SERVICE_MANAGER_DIR + 'servicemanager.json'

const createSystemMock = () => {
  const systemMock = new SystemMock()
  systemMock.setMockFile(CONFIG_FILE, STRINGIFIED_CONFIG)

  systemMock.setMockCommand(
    'sc.exe query "MysteriumClient"',
    `SERVICE_NAME: MysteriumClient
      STATE       : 0  RUNNING \r\n`)

  systemMock.setMockCommand('/tmp/ovpnbin --show-adapters', `123
    'Ethernet' {F1343629-CB94-4D28-9AE4-147F9145798E}
    asd`)
  return systemMock
}

describe('ServiceManagerInstaller', () => {
  const config = {
    clientBin: '/tmp/clientbin',
    configDir: '/tmp/config',
    openVPNBin: '/tmp/ovpnbin',
    dataDir: '/tmp/data',
    runtimeDir: '/tmp/runtime',
    logDir: '/tmp/logs',
    tequilapiPort: 4050,
    stdErrFileName: 'stderr.log',
    stdOutFileName: 'stdout.log',
    systemLogPath: '/tmp/logs/system.log'
  }

  let systemMockManager: SystemMockManager
  let system: System

  beforeEach(() => {
    const systemMock = createSystemMock()
    system = (systemMock: System)
    systemMockManager = (systemMock: SystemMockManager)
  })

  describe('.needsInstallation()', () => {
    it('returns false when all checks pass', async () => {
      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      expect(await installer.needsInstallation()).to.be.false
    })

    it('returns true when config does not exits', async () => {
      systemMockManager.unsetMockFile(CONFIG_FILE)
      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      expect(await installer.needsInstallation()).to.be.true
    })

    it('returns true when config does not match existing', async () => {
      systemMockManager.setMockFile(CONFIG_FILE, 'invalid config file contents')
      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      expect(await installer.needsInstallation()).to.be.true
    })

    it('returns true when service is not installed', async () => {
      systemMockManager.unsetMockCommand('sc.exe query "MysteriumClient"')
      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      expect(await installer.needsInstallation()).to.be.true
    })

    it('returns true when drivers are not installed', async () => {
      systemMockManager.unsetMockCommand('/tmp/ovpnbin --show-adapters')
      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      expect(await installer.needsInstallation()).to.be.true
    })
  })

  describe('.install()', () => {
    it('writes config file when config does not exist', async () => {
      systemMockManager.unsetMockFile(CONFIG_FILE)

      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      await installer.install()

      expect(systemMockManager.writeFileReturnValue).to.be.eql(STRINGIFIED_CONFIG)
    })

    it('writes config file when checksum does not match', async () => {
      systemMockManager.setMockFile(CONFIG_FILE, 'invalid config file contents')

      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      await installer.install()

      expect(systemMockManager.writeFileReturnValue).to.be.eql(STRINGIFIED_CONFIG)
    })

    it('installs service when service is not installed', async () => {
      systemMockManager.unsetMockCommand('sc.exe query "MysteriumClient"')

      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      await installer.install()

      expect(systemMockManager.sudoExecCalledCommands[0]).to.be.eql(
        '/service-manager/bin/servicemanager.exe --do=install')
    })

    it('installs TAP drivers when they are not installed', async () => {
      systemMockManager.unsetMockCommand('/tmp/ovpnbin --show-adapters')

      const installer = new ServiceManagerInstaller(system, config, SERVICE_MANAGER_DIR)
      await installer.install()

      expect(systemMockManager.userExecCalledCommands[2]).to.be.eql('/service-manager/bin/tap-windows.exe')
    })
  })
})
