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

import {spawn} from 'child_process'
import logLevels from '../log-levels'

/**
 * 'mysterium_client' process handler
 */
class Process {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor (config) {
    this.config = config
  }

  start () {
    this.child = spawn(this.config.clientBin, [
      '--config-dir', this.config.configDir,
      '--runtime-dir', this.config.runtimeDir,
      '--openvpn.binary', this.config.openVPNBin,
      '--tequilapi.port', this.config.tequilapiPort
    ])
  }

  stop () {
    this.child.kill('SIGTERM')
  }

  /**
   * Registers a callback for a specific process log/error message
   *
   * @param {string} level
   * @param {LogCallback} cb
   */
  onLog (level, cb) {
    this._getStreamForLevel(level).on('data', (data) => {
      cb(data.toString())
    })
  }

  /**
   * Converts log level to child process members 'child.stdout' and 'child.stderr'
   *
   * @param {string} level
   * @return {Readable}
   * @private
   */
  _getStreamForLevel (level) {
    switch (level) {
      case logLevels.INFO:
        return this.child.stdout
      case logLevels.ERROR:
        return this.child.stderr
      default:
        throw new Error(`Unknown logging level: ${level}`)
    }
  }
}

export default Process

/**
 * @callback LogCallback
 * @param {string} data - chunk of log output
 */
