/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
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

import { Tail } from 'tail'
import path from 'path'
import processLogLevels from '../log-levels'
import { INVERSE_DOMAIN_PACKAGE_NAME } from './config'
import axios from 'axios'
import logger from '../../../app/logger'
import createFileIfMissing from '../../create-file-if-missing'

const SYSTEM_LOG = '/var/log/system.log'
const stdoutFileName = 'stdout.log'
const stderrFileName = 'stderr.log'

/**
 * Spawns and stops 'mysterium_client' daemon on OSX
 */
class Process {
  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {string} daemonPort - port at which tequilapi is listening
   * @param {string} logDirectory - directory where it's looking for logs
   */
  constructor (tequilapi, daemonPort, logDirectory) {
    this.tequilapi = tequilapi
    this.daemonPort = daemonPort
    this.stdoutPath = path.join(logDirectory, stdoutFileName)
    this.stderrPath = path.join(logDirectory, stderrFileName)
    this._subscribers = {
      [processLogLevels.LOG]: [],
      [processLogLevels.ERROR]: []
    }
  }

  start () {
    return axios.get('http://127.0.0.1:' + this.daemonPort)
      .then(() => {
        logger.info('Touched the daemon, now it should be up')
      })
      .catch(() => {
        logger.info('Touched the daemon with error, anyway it should be up')
      })
  }

  _logCallback (level, data) {
    for (let sub of this._subscribers[level]) {
      sub(data)
    }
  }

  async _prepareLogFiles () {
    await createFileIfMissing(this.stdoutPath)
    await createFileIfMissing(this.stderrPath)
  }

  async setupLogging () {
    await this._prepareLogFiles()
    tailFile(this.stdoutPath, this._logCallback.bind(this, processLogLevels.LOG))
    tailFile(this.stderrPath, this._logCallback.bind(this, processLogLevels.ERROR))
    tailFile(SYSTEM_LOG, filterLine(INVERSE_DOMAIN_PACKAGE_NAME, this._logCallback.bind(this, processLogLevels.ERROR)))
  }

  onLog (level, cb) {
    this._subscribers[level].push(cb)
  }

  async stop () {
    await this.tequilapi.stop()
    logger.info('Client Quit was successful')
  }
}

function tailFile (filePath, cb) {
  const logTail = new Tail(filePath)
  logTail.on('line', cb)
  logTail.on('error', () => {
    logger.error(`log file watching failed. file probably doesn't exist: ${filePath}`)
  })
}

function filterLine (filter, cb) {
  const regex = new RegExp(filter)

  return (data) => {
    if (!regex.test(data)) {
      return
    }
    cb(data)
  }
}

export default Process
