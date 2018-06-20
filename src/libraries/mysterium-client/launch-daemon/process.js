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
import createFileIfMissing from '../../create-file-if-missing'
import { applyTransformation, filterByString, prependWith } from '../../string-transform'

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
   * @param {string} daemonPort - port at which the daemon is spawned
   * @param {string} logDirectory - directory where it's looking for logs
   */
  constructor (tequilapi, daemonPort, logDirectory) {
    this.tequilapi = tequilapi
    this._daemonPort = daemonPort
    this._stdoutPath = path.join(logDirectory, stdoutFileName)
    this._stderrPath = path.join(logDirectory, stderrFileName)
    this._subscribers = {
      [processLogLevels.INFO]: [],
      [processLogLevels.ERROR]: []
    }
  }

  start () {
    return axios.get('http://127.0.0.1:' + this._daemonPort)
      .then(() => {
        console.info('Touched the daemon, now it should be up')
      })
      .catch(() => {
        console.info('Touched the daemon with error, anyway it should be up')
      })
  }

  async stop () {
    await this.tequilapi.stop()
    console.info('Client Quit was successful')
  }

  async setupLogging () {
    await this._prepareLogFiles()
    const boundErrorCb = this._logCallback.bind(this, processLogLevels.ERROR)
    tailFile(this._stdoutPath, this._logCallback.bind(this, processLogLevels.INFO))
    tailFile(this._stderrPath, applyTransformation(prependWith(new Date(Date.now()).toString()), boundErrorCb))
    tailFile(SYSTEM_LOG, applyTransformation(filterByString(INVERSE_DOMAIN_PACKAGE_NAME), boundErrorCb))
  }

  onLog (level, cb) {
    if (!this._subscribers[level]) throw new Error(`Unknown process logging level: ${level}`)
    this._subscribers[level].push(cb)
  }

  _logCallback (level, data) {
    for (let sub of this._subscribers[level]) {
      sub(data)
    }
  }

  async _prepareLogFiles () {
    await createFileIfMissing(this._stdoutPath)
    await createFileIfMissing(this._stderrPath)
  }
}

function tailFile (filePath, cb) {
  const logTail = new Tail(filePath)
  logTail.on('line', cb)
  logTail.on('error', () => {
    console.error(`log file watching failed. file probably doesn't exist: ${filePath}`)
  })
}

export default Process
