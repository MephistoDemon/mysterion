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

import {Tail} from 'tail'
import path from 'path'
import logLevels from '../log-levels'
import logger from '../../../app/logger'

/**
 * Spawns 'mysterium_client' daemon on OSX by calling TequilapiClient.healthcheck()
 */
class Process {
  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {string} dataDir - directory where it's looking for logs
   */
  constructor (tequilapi, dataDir) {
    this.tequilapi = tequilapi
    this.dataDir = dataDir
  }

  start () {
    this.tequilapi.healthCheck()
      .then(() => {
        logger.info('Touched the daemon with error, anyway it should be up')
      })
      .catch(() => {
        logger.info('Touched the daemon, now it must be up')
      })
  }

  onLog (level, cb) {
    tailFile(this._getFileForLevel(level), cb)
  }

  async stop () {
    await this.tequilapi.stop()
    logger.info('Client Quit was successful')
  }

  /**
   * Converts log level to log files 'stdout.log' or 'stderr.log'
   *
   * @param {string} level
   * @return {string}
   * @private
   */
  _getFileForLevel (level) {
    switch (level) {
      case logLevels.LOG:
        return path.join(this.dataDir, 'stdout.log')
      case logLevels.ERROR:
        return path.join(this.dataDir, 'stderr.log')
      default:
        throw new Error(`Unknown daemon logging level: ${level}`)
    }
  }
}

function tailFile (filePath, cb) {
  try {
    const logTail = new Tail(filePath)
    logTail.on('line', cb)
    logTail.on('error', cb)
  } catch (e) {
    logger.error('log file watching failed. file probably doesn\'t exist: ' + filePath)
  }
}

export default Process
