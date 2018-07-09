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

import os from 'os'
import md5 from 'md5'
import path from 'path'
import logger from '../../../app/logger'
import type { ClientConfig } from '../config'
import type { Installer } from '../index'
import System from '../system'

const SERVICE_NAME = 'MysteriumClient'
const SERVICE_MANAGER_BIN = 'service.exe'
const SERVICE_MANAGER_CONFIG = 'service.json'
const TAP_DRIVER_BIN = 'windows-tap.exe'

class ServiceManagerInstaller implements Installer {
  _system: System
  _config: ClientConfig
  _serviceManagerDir: string

  constructor (system: System, config: ClientConfig, serviceManagerDir: string) {
    this._system = system
    this._config = config
    this._serviceManagerDir = serviceManagerDir
  }

  async needsInstallation (): boolean {
    if (!this._configExists()) {
      logger.info('[needs-install] config does not exist')

      return true
    }

    if (this._configChecksumMismatch()) {
      logger.info('[needs-install] checksum mismatch')

      return true
    }

    if (!await this._serviceInstalled()) {
      logger.info('[needs-install] service not installed')

      return true
    }

    if (!await this._tapDriversInstalled()) {
      logger.info('[needs-install] drivers not installed')

      return true
    }

    return false
  }

  async install (): Promise<void> {
    if (!this._configExists() || this._configChecksumMismatch()) {
      logger.info('[install] config needs to be recreated')

      await this._system.writeFile(this._getConfigPath(), this._getServiceManagerConfigContents())
    }

    if (!await this._serviceInstalled()) {
      logger.info('[install] installing service')

      await this._installService()
    }

    if (!await this._tapDriversInstalled()) {
      logger.info('[install] installing tap drivers')

      await this._installTapDrivers()
    }
  }

  _configExists () {
    return this._system.fileExists(this._getConfigPath())
  }

  _configChecksumMismatch () {
    const config = md5(this._getServiceManagerConfigContents())
    const installedConfig = md5(this._system.readFile(this._getConfigPath()))

    return config !== installedConfig
  }

  async _serviceInstalled () {
    let stdout
    try {
      stdout = await this._system.userExec(`sc.exe query "${SERVICE_NAME}"`)
    } catch (e) {
      logger.info('Service check failed', e.message)
      return false
    }

    return stdout.indexOf(`SERVICE_NAME: ${SERVICE_NAME}`) > -1
  }

  async _tapDriversInstalled (): boolean {
    let stdout
    try {
      stdout = await this._system.userExec(this._config.openVPNBin + ` --show-adapters`)
    } catch (e) {
      logger.info('Check for tap drivers failed', e.message)
      return false
    }

    return this._stdoutHasGuid(stdout)
  }

  _stdoutHasGuid (stdout: string): boolean {
    let lines = stdout.split(os.EOL)

    const guidRule = /{[A-Z0-9]{8}-([A-Z0-9]{4}-){3}[A-Z0-9]{12}}/i

    lines = lines.filter(line => {
      return line.match(guidRule)
    })

    return lines.length > 0
  }

  async _installTapDrivers () {
    await this._system.userExec(path.join(this._serviceManagerDir, TAP_DRIVER_BIN))
  }

  async _installService () {
    const serviceManagerPath = path.join(this._serviceManagerDir, SERVICE_MANAGER_BIN)
    const command = `${serviceManagerPath} --do=install && ${serviceManagerPath} --do=start`

    await this._system.sudoExec(command, {name: 'Mysterion'})
  }

  _getConfigPath () {
    return path.join(this._serviceManagerDir, SERVICE_MANAGER_CONFIG)
  }

  _getServiceManagerConfigContents () {
    const file = {
      'Name': SERVICE_NAME,
      'DisplayName': 'Mysterium Client',
      'Description': 'Mysterium Client service',
      'Directory': this._config.runtimeDir,
      'Executable': this._config.clientBin,
      'Port': this._config.tequilapiPort,
      'Arguments': [
        `--config-dir=${this._config.configDir}`,
        `--data-dir=${this._config.dataDir}`,
        `--runtime-dir=${this._config.runtimeDir}`,
        `--openvpn.binary=${this._config.openVPNBin}`,
        `--tequilapi.port=${this._config.tequilapiPort}`
      ],
      'Logging': {
        'Stderr': path.join(this._config.logDir, 'stderr.log'),
        'Stdout': path.join(this._config.logDir, 'stdout.log')
      }
    }

    return JSON.stringify(file)
  }
}

export default ServiceManagerInstaller
