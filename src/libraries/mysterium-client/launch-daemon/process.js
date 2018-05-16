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

import {Tail} from 'tail'
import path from 'path'
import logLevels from '../log-levels'
import {InverseDomainPackageName} from './config'

const SYSTEM_LOG = '/var/log/system.log'

/**
 * Spawns 'mysterium_client' daemon on OSX by calling TequilapiClient.healthcheck()
 */
class Process {
  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {string} logDirectory - directory where it's looking for logs
   */
  constructor (tequilapi, logDirectory) {
    this.tequilapi = tequilapi
    this.logDirectory = logDirectory
  }

  start () {
    this.tequilapi.healthCheck()
      .then(() => {
        console.log('Touched the daemon, now it should be up')
      })
      .catch(() => {
        console.log('Touched the daemon with error, anyway it should be up')
      })
  }

  onLog (level, cb) {
    if (level === logLevels.LOG) {
      tailFile(path.join(this.logDirectory, 'stdout.log'), cb)
      return
    }

    if (level === logLevels.ERROR) {
      tailFile(path.join(this.logDirectory, 'stderr.log'), cb)
      tailFile(SYSTEM_LOG, filterLine(InverseDomainPackageName, cb))
      return
    }

    throw new Error(`Unknown daemon logging level: ${level}`)
  }

  async stop () {
    await this.tequilapi.stop()
    console.log('Client Quit was successful')
  }
}

function tailFile (filePath, cb) {
  const logTail = new Tail(filePath)
  logTail.on('line', cb)
  logTail.on('error', () => {
    console.error(`log file watching failed. file probably doesn't exist: ` + filePath)
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
