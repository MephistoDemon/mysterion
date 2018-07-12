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

// @flow

import { Tail } from 'tail'
import path from 'path'
import type { TequilapiClient } from '../../mysterium-tequilapi/client'
import type { LogCallback, Process } from '../index'
import processLogLevels from '../log-levels'
import { INVERSE_DOMAIN_PACKAGE_NAME } from './config'
import axios from 'axios'
import createFileIfMissing from '../../create-file-if-missing'
import { prependWithFn, getCurrentTimeISOFormat } from '../../strings'

const SYSTEM_LOG = '/var/log/system.log'
const stdoutFileName = 'stdout.log'
const stderrFileName = 'stderr.log'

type Subscribers = {
  [processLogLevels.INFO | processLogLevels.ERROR]: Array<LogCallback>,
}

/**
 * Spawns and stops 'mysterium_client' daemon on OSX
 */
class LaunchDaemonProcess implements Process {
  _tequilapi: TequilapiClient
  _daemonPort: number
  _stdoutPath: string
  _stderrPath: string
  _subscribers: Subscribers

  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {string} daemonPort - port at which the daemon is spawned
   * @param {string} logDirectory - directory where it's looking for logs
   */
  constructor (tequilapi: TequilapiClient, daemonPort: number, logDirectory: string) {
    this._tequilapi = tequilapi
    this._daemonPort = daemonPort
    this._stdoutPath = path.join(logDirectory, stdoutFileName)
    this._stderrPath = path.join(logDirectory, stderrFileName)
    this._subscribers = {
      [processLogLevels.INFO]: [],
      [processLogLevels.ERROR]: []
    }
  }

  async start (): Promise<void> {
    await this._spawnOsXLaunchDaemon()
  }

  async stop (): Promise<void> {
    await this._tequilapi.stop()
  }

  async setupLogging (): Promise<void> {
    await this._prepareLogFiles()

    const notifyOnErrorSubscribers = this._notifySubscribersWithLog.bind(this, processLogLevels.ERROR)

    tailFile(this._stdoutPath, this._notifySubscribersWithLog.bind(this, processLogLevels.INFO))
    tailFile(this._stderrPath, (data) => {
      notifyOnErrorSubscribers(prependWithCurrentTime(prependWithSpace(data)))
    })

    tailFile(SYSTEM_LOG, (data) => {
      if (data.includes(INVERSE_DOMAIN_PACKAGE_NAME)) notifyOnErrorSubscribers(data)
    })
  }

  onLog (level: string, cb: LogCallback): void {
    if (!this._subscribers[level]) {
      throw new Error(`Unknown process logging level: ${level}`)
    }

    this._subscribers[level].push(cb)
  }

  _notifySubscribersWithLog (level: string, data: mixed): void {
    for (let sub of this._subscribers[level]) {
      sub(data)
    }
  }

  async _prepareLogFiles (): Promise<void> {
    await createFileIfMissing(this._stdoutPath)
    await createFileIfMissing(this._stderrPath)
  }

  async _spawnOsXLaunchDaemon (): Promise<void> {
    try {
      await axios.get('http://127.0.0.1:' + this._daemonPort)
    } catch (e) {
      // no http server is running on `_daemonPort`, so request results in a failure
      // if some service is responding on daemonPort then additional healthcheck ensures tequilapi is accessible
    }
  }
}

function tailFile (filePath: string, cb: LogCallback): void {
  const logTail = new Tail(filePath)
  logTail.on('line', cb)
  logTail.on('error', () => {
    // TODO: fix no-console logging in libs
    // eslint-disable-next-line
    console.error(`log file watching failed. file probably doesn't exist: ${filePath}`)
  })
}

const prependWithCurrentTime = prependWithFn(getCurrentTimeISOFormat)
const prependWithSpace = prependWithFn(() => ` `)

export default LaunchDaemonProcess
