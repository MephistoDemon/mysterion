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
import type { System } from '../system'
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

export { SERVICE_STATE }
export type { ServiceState }

const parseServiceState = (serviceInfo: string): ServiceState => {
  const isInstalled: boolean = serviceInfo.indexOf(`SERVICE_NAME: ${SERVICE_NAME}`) > -1
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
    return this._sudoExec(`${this._path} --do=install && ${this._path} --do=start`)
  }

  async start (): Promise<ServiceState> {
    return this._execAndGetState('start')
  }

  async stop (): Promise<ServiceState> {
    return this._execAndGetState('stop')
  }

  async restart (): Promise<ServiceState> {
    return this._execAndGetState('restart')
  }

  async getServiceState (): Promise<ServiceState> {
    let stdout
    try {
      stdout = await this._system.userExec(`sc.exe query "${SERVICE_NAME}"`)
    } catch (e) {
      logger.error('Service check failed', e.message)
      return SERVICE_STATE.UNKNOWN
    }
    return parseServiceState(stdout)
  }

  async _execAndGetState (commandName: string): Promise<ServiceState> {
    const result = await this._sudoExec(`${this._path} --do=${commandName}`)
    return parseServiceState(result)
  }

  async _sudoExec (command: string): Promise<string> {
    try {
      return await this._system.sudoExec(command)
    } catch (e) {
      throw new Error(`Unable to start "${SERVICE_NAME}" service. ${e}`)
    }
  }
}
