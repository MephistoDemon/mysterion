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

import path from 'path'
import logger from '../../../app/logger'
import type { LogCallback, Process } from '../index'
import type { TequilapiClient } from '../../mysterium-tequilapi/client'
import type { System } from '../system'
import { SERVICE_MANAGER_BIN, SERVICE_NAME } from './service-manager-installer'
import sleep from '../../sleep'

/***
 * Time in milliseconds requires to fully activate Mysterium client
 * @type {number}
 */
const SERVICE_INIT_TIME = 8000

const SERVICE_STATE = {
  NOT_INSTALLED: 'NOT_INSTALLED',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  START_PENDING: 'START_PENDING',
  STOP_PENDING: 'STOP_PENDING'
}
type ServiceState = $Values<typeof SERVICE_STATE>

class ServiceManagerProcess implements Process {
  _tequilapi: TequilapiClient
  _serviceManagerDir: string
  _system: System
  _startIsRunning: boolean
  _startingFirstTime: boolean

  constructor (tequilapi: TequilapiClient, serviceManagerDir: string, system: System) {
    this._tequilapi = tequilapi
    this._serviceManagerDir = serviceManagerDir
    this._system = system
    this._startingFirstTime = true
  }

  async start (): Promise<void> {
    if (this._startIsRunning) {
      return
    }
    this._startIsRunning = true
    try {
      let state = await this._serviceState()
      logger.info(`Service state: [${state}]`)
      if (state === SERVICE_STATE.START_PENDING) {
        return
      }
      if (this._startingFirstTime && state === SERVICE_STATE.RUNNING) {
        return
      }
      const serviceManagerPath = path.join(this._serviceManagerDir, SERVICE_MANAGER_BIN)
      const operation = state === SERVICE_STATE.RUNNING ? 'restart' : 'start'
      const command = `${serviceManagerPath} --do=${operation}`
      logger.info('Running command', command)
      const serviceInfo = await this._system.sudoExec(command)
      state = this._parseServiceState(serviceInfo)

      // wait until service will be started
      while (state !== SERVICE_STATE.RUNNING) {
        state = await this._serviceState()
      }

      // Wait for client initialization
      await sleep(SERVICE_INIT_TIME)
    } catch (e) {
      throw e
    } finally {
      this._startIsRunning = false
      this._startingFirstTime = false
    }
  }

  async stop (): Promise<void> {
    // we shouldn't kill the process, just make sure it's disconnected
    // since this is service managed process
    await this._tequilapi.connectionCancel()
  }

  async setupLogging (): Promise<void> {

  }

  onLog (level: string, cb: LogCallback): void {
  }

  async _serviceState (): Promise<ServiceState> {
    let stdout
    try {
      stdout = await this._system.userExec(`sc.exe query "${SERVICE_NAME}"`)
    } catch (e) {
      logger.info('Service check failed', e.message)
      return SERVICE_STATE.NOT_INSTALLED
    }
    return this._parseServiceState(stdout)
  }

  _parseServiceState (serviceInfo: string): ServiceState {
    const isInstalled: boolean = serviceInfo.indexOf(`SERVICE_NAME: ${SERVICE_NAME}`) > -1
    if (!isInstalled) {
      return SERVICE_STATE.NOT_INSTALLED
    }

    let start = serviceInfo.indexOf('STATE')
    start = serviceInfo.indexOf(':', start)
    start = serviceInfo.indexOf('  ', start) + 2
    const length = serviceInfo.indexOf('\r', start) - start - 1
    const state = serviceInfo.substr(start, length)
    if (Object.values(SERVICE_STATE).indexOf(state) < 0) {
      throw new Error('Unknown Windows service state: ' + state)
    }
    return (state: ServiceState)
  }
}

export default ServiceManagerProcess
