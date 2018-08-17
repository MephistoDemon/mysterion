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
import type { Command, System } from '../system'
import logger from '../../../app/logger'
import { SERVICE_NAME } from './service-manager-installer'

const SERVICE_STATE = {
  UNKNOWN: 'UNKNOWN',
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  START_PENDING: 'START_PENDING',
  STOP_PENDING: 'STOP_PENDING'
}
type ServiceState = $Values<typeof SERVICE_STATE>

type ServiceManagerOperation = 'start' | 'stop' | 'install' | 'uninstall' | 'restart'

export { SERVICE_STATE }
export type { ServiceState }

const parseServiceState = (serviceInfo: string): ServiceState => {
  const isInstalled: boolean = serviceInfo.includes(`SERVICE_NAME: ${SERVICE_NAME}`)
  if (!isInstalled) {
    return SERVICE_STATE.UNKNOWN
  }

  let start = serviceInfo.indexOf('STATE')
  if (start < 0) {
    return SERVICE_STATE.UNKNOWN
  }

  start = serviceInfo.indexOf(':', start)
  if (start < 0) {
    return SERVICE_STATE.UNKNOWN
  }

  start = serviceInfo.indexOf('  ', start) + 2
  if (start < 0) {
    return SERVICE_STATE.UNKNOWN
  }

  const length = serviceInfo.indexOf('\r', start) - start - 1
  if (length < 0) {
    return SERVICE_STATE.UNKNOWN
  }

  const state = serviceInfo.substr(start, length)
  if (Object.values(SERVICE_STATE).indexOf(state) < 0) {
    throw new Error('Unknown Windows service state: ' + state)
  }

  return (state: ServiceState)
}

const needReinstall = (e: Error): boolean => {
  // double check type, because flow can't do that at runtime
  return e instanceof Error && e.message.includes('Command failed')
}

export default class ServiceManager {
  _path: string
  _system: System

  constructor (serviceManagerPath: string, system: System) {
    this._path = serviceManagerPath
    this._system = system
  }

  get directory (): string {
    return path.dirname(this._path)
  }

  async install (): Promise<string> {
    return this._execOperations('install', 'start')
  }

  async reinstall (): Promise<string> {
    const commands = ['uninstall', 'install', 'start']
    const state = this.getServiceState()
    if (state === SERVICE_STATE.RUNNING) {
      commands.unshift('stop')
    }
    return this._execOperations(...commands)
  }

  async start (): Promise<ServiceState> {
    return this._execAndGetState('start', true)
  }

  async stop (): Promise<ServiceState> {
    return this._execAndGetState('stop')
  }

  async restart (): Promise<ServiceState> {
    return this._execAndGetState('restart', true)
  }

  async getServiceState (): Promise<ServiceState> {
    let stdout
    try {
      stdout = await this._system.userExec({
        path: 'sc.exe',
        args: ['query', `"${SERVICE_NAME}"`]
      })
    } catch (e) {
      logger.error('Service check failed', e.message)
      return SERVICE_STATE.UNKNOWN
    }
    return parseServiceState(stdout)
  }

  async _execOperations (...operations: ServiceManagerOperation[]): Promise<string> {
    return this._sudoExec(...operations.map(c => this._createCommandFromOperation(c)))
  }

  _createCommandFromOperation (operation: ServiceManagerOperation): Command {
    return {
      path: this._path,
      args: [`--do=${operation}`]
    }
  }

  async _execAndGetState (operation: ServiceManagerOperation, reinstallOnError: boolean = false): Promise<ServiceState> {
    let state = SERVICE_STATE.UNKNOWN
    try {
      const result = await this._execOperations(operation)
      state = parseServiceState(result)
    } catch (e) {
      if (reinstallOnError && needReinstall(e)) {
        await this.reinstall()
        state = SERVICE_STATE.START_PENDING
      } else {
        throw e
      }
    }
    return state
  }

  async _sudoExec (...commands: Command[]): Promise<string> {
    try {
      logger.info('Execute sudo', JSON.stringify(commands))
      return await this._system.sudoExec(...commands)
    } catch (e) {
      throw new Error(`Unable to execute [${JSON.stringify(commands)}]. ${e}`)
    }
  }
}
