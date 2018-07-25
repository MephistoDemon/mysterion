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

import type { TequilapiClient } from '../../mysterium-tequilapi/client'
import type { LogCallback, Process } from '../index'
import axios from 'axios'
import ClientLogSubscriber from '../client-log-subscriber'

/**
 * Spawns and stops 'mysterium_client' daemon on OSX
 */
class LaunchDaemonProcess implements Process {
  _tequilapi: TequilapiClient
  _daemonPort: number
  _logs: ClientLogSubscriber

  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {ClientLogSubscriber} logs
   * @param {string} daemonPort - port at which the daemon is spawned
   */
  constructor (tequilapi: TequilapiClient, logs: ClientLogSubscriber, daemonPort: number) {
    this._tequilapi = tequilapi
    this._logs = logs
    this._daemonPort = daemonPort
  }

  async start (): Promise<void> {
    await this._spawnOsXLaunchDaemon()
  }

  async stop (): Promise<void> {
    await this._tequilapi.stop()
  }

  async setupLogging (): Promise<void> {
    await this._logs.setup()
  }

  onLog (level: string, cb: LogCallback): void {
    this._logs.onLog(level, cb)
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

export default LaunchDaemonProcess
