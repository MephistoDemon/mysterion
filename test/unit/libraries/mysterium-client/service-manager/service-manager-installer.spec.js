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
import ServiceManagerInstaller from '../../../../../src/libraries/mysterium-client/service-manager/service-manager-installer'
import type { System } from '../../../../../src/libraries/mysterium-client/system'

class SystemMock implements System {
  fileExistsReturnValue = true
  readFileReturnValue = null
  writeFileReturnValue = null
  serviceInstalled = true
  driverInstalled = true
  userExecCalledTimes = 0
  sudoExecCalledTimes = 0

  fileExists (file: string): boolean {
    return this.fileExistsReturnValue
  }

  async writeFile (file: string, content: string): Promise<void> {
    this.writeFileReturnValue = content
  }

  readFile (file: string): string {
    if (this.readFileReturnValue) {
      return this.readFileReturnValue
    }

    return JSON.stringify({
      'Name': 'MysteriumClient',
      'DisplayName': 'Mysterium Client',
      'Description': 'Mysterium Client service',
      'Directory': '/tmp/runtime',
      'Executable': '/tmp/clientbin',
      'Port': 4050,
      'Arguments': [
        '--config-dir=/tmp/config',
        '--data-dir=/tmp/data',
        '--runtime-dir=/tmp/runtime',
        '--openvpn.binary=/tmp/ovpnbin',
        '--tequilapi.port=4050'
      ],
      'Logging': {
        'Stderr': '/tmp/logs/stderr.log',
        'Stdout': '/tmp/logs/stdout.log'
      }
    })
  }

  async userExec (command: string): Promise<string> {
    // this is hacky, but userExec gets called multiple times
    // and must return different outputs
    this.userExecCalledTimes++

    if (this.userExecCalledTimes === 1 && this.serviceInstalled) {
      return 'SERVICE_NAME: MysteriumClient'
    }

    if (this.userExecCalledTimes === 2 && this.driverInstalled) {
      return `123
          'Ethernet' {F1343629-CB94-4D28-9AE4-147F9145798E}
          asd`
    }

    return ''
  }

  async sudoExec (command: string): Promise<string> {
    this.sudoExecCalledTimes++

    return ''
  }
}

describe('ServiceManagerInstaller', () => {
  const config = {
    clientBin: '/tmp/clientbin',
    configDir: '/tmp/config',
    openVPNBin: '/tmp/ovpnbin',
    dataDir: '/tmp/data',
    runtimeDir: '/tmp/runtime',
    logDir: '/tmp/logs',
    tequilapiPort: 4050
  }

  let system
  describe('.needsInstallation()', () => {
    beforeEach(() => {
      system = new SystemMock()
    })

    it('does not need installation when all checks pass', async () => {
      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      expect(await installer.needsInstallation()).to.be.eql(false)
    })

    it('returns true when config does not exits', async () => {
      system.fileExistsReturnValue = false
      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      expect(await installer.needsInstallation()).to.be.eql(true)
    })

    it('returns true when config does not match existing', async () => {
      system.readFileReturnValue = 'invalid json'
      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      expect(await installer.needsInstallation()).to.be.eql(true)
    })

    it('returns true when service is not installed', async () => {
      system.serviceInstalled = false
      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      expect(await installer.needsInstallation()).to.be.eql(true)
    })

    it('returns true when drivers are not installed', async () => {
      system.driverInstalled = false
      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      expect(await installer.needsInstallation()).to.be.eql(true)
    })
  })

  describe('.install()', () => {
    beforeEach(() => {
      system = new SystemMock()
    })

    it('writes config file when config does not exist', async () => {
      system.fileExistsReturnValue = false

      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      await installer.install()

      expect(system.writeFileReturnValue).to.be.not.empty
    })

    it('writes config file when checksum does not match', async () => {
      system.readFileReturnValue = 'xxx'

      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      await installer.install()

      expect(system.writeFileReturnValue).to.be.not.empty
    })

    it('installs service when service is not installed', async () => {
      system.serviceInstalled = false

      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      await installer.install()

      expect(system.sudoExecCalledTimes).to.be.eql(1)
    })

    it('installs TAP drivers when they are not installed', async () => {
      system.driverInstalled = false

      const installer = new ServiceManagerInstaller(system, config, '/service-manager/bin/')
      await installer.install()

      expect(system.userExecCalledTimes).to.be.eql(3)
    })
  })
})
