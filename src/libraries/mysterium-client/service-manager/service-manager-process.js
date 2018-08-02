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

import logger from '../../../app/logger'
import type { LogCallback, Process } from '../index'
import type { TequilapiClient } from '../../mysterium-tequilapi/client'
import type { System } from '../system'
import ClientLogSubscriber from '../client-log-subscriber'
import Monitoring from '../monitoring'
import type { StatusCallback } from '../monitoring'
import ServiceManager, { SERVICE_STATE } from './service-manager'
import type { ServiceState } from './service-manager'

/***
 * Time in milliseconds required to fully activate Mysterium client
 * @type {number}
 */
const SERVICE_INIT_TIME = 8000

class ServiceManagerProcess implements Process {
  _tequilapi: TequilapiClient
  _logs: ClientLogSubscriber
  _serviceManagerDir: string
  _serviceManager: ServiceManager
  _system: System
  _monitoring: Monitoring
  _fixIsRunning: boolean = false

  constructor (
    tequilapi: TequilapiClient,
    logs: ClientLogSubscriber,
    serviceManager: ServiceManager,
    system: System,
    monitoring: Monitoring) {
    this._tequilapi = tequilapi
    this._logs = logs
    this._serviceManager = serviceManager
    this._system = system
    this._monitoring = monitoring
  }

  async start (): Promise<void> {
    const state = await this._serviceManager.getServiceState()
    if (state === SERVICE_STATE.RUNNING) {
      return
    }

    await this._fixService(state)
  }

  async repair (): Promise<void> {
    await this._fixService()
  }

  async stop (): Promise<void> {
    // we shouldn't kill the process, just make sure it's disconnected
    // since this is service managed process
    await this._tequilapi.connectionCancel()
  }

  async setupLogging (): Promise<void> {
    await this._logs.setup()
  }

  onLog (level: string, cb: LogCallback): void {
    this._logs.onLog(level, cb)
  }

  async _fixService (state: ?ServiceState = null): Promise<void> {
    if (this._fixIsRunning) {
      return
    }
    this._fixIsRunning = true
    try {
      state = state || await this._serviceManager.getServiceState()
      logger.info(`Service state: [${state}]`)
      switch (state) {
        case SERVICE_STATE.START_PENDING:
          return
        case SERVICE_STATE.UNKNOWN:
          throw new Error('Cannot start non-installed service')
        case SERVICE_STATE.RUNNING:
          await this._serviceManager.restart()
          break
        default:
          await this._serviceManager.start()
      }
      await this._waitForHealthCheck()
    } finally {
      this._fixIsRunning = false
    }
  }

  async _waitForHealthCheck (): Promise<void> {
    let statusCallback: ?StatusCallback
    await new Promise((resolve, reject) => {
      const rejectTimer = setTimeout(() => reject(new Error('Unable to start service')), SERVICE_INIT_TIME)
      statusCallback = (isRunning: boolean) => {
        if (isRunning) {
          clearTimeout(rejectTimer)
          resolve()
        }
      }
      this._monitoring.onStatus(statusCallback)
    })

    if (statusCallback) {
      this._monitoring.removeOnStatus(statusCallback)
    }
  }
}

export default ServiceManagerProcess
