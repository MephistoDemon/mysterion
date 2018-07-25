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

import processLogLevels from './log-levels'
import type { LogCallback } from './index'
import createFileIfMissing from '../create-file-if-missing'
import { INVERSE_DOMAIN_PACKAGE_NAME } from './launch-daemon/config'
import { toISOString, prependWithFn } from '../strings'

type Subscribers = {
  [processLogLevels.INFO | processLogLevels.ERROR]: Array<LogCallback>,
}

type DateFunction = () => Date
type TailFunction = (filePath: string, logCallback: LogCallback) => void

const prependWithSpace = prependWithFn(() => ` `)

class ClientLogSubscriber {
  _subscribers: Subscribers
  _stdoutPath: string
  _stderrPath: string
  _systemFilePath: string
  _dateFunction: DateFunction
  _tailFunction: TailFunction

  constructor (stdoutFilePath: string, stderrFilePath: string, systemLogFilePath: string, dateFunction: DateFunction, tailFunction: TailFunction) {
    this._stdoutPath = stdoutFilePath
    this._stderrPath = stderrFilePath
    this._systemFilePath = systemLogFilePath
    this._dateFunction = dateFunction
    this._tailFunction = tailFunction

    this._subscribers = {
      [processLogLevels.INFO]: [],
      [processLogLevels.ERROR]: []
    }
  }

  async setup (): Promise<void> {
    await this._prepareLogFiles()

    const notifyOnErrorSubscribers = this._notifySubscribersWithLog.bind(this, processLogLevels.ERROR)
    const prependWithCurrentTime = prependWithFn(() => toISOString(this._dateFunction()))

    this._tailFile(this._stdoutPath, this._notifySubscribersWithLog.bind(this, processLogLevels.INFO))
    this._tailFile(this._stderrPath, (data) => {
      notifyOnErrorSubscribers(prependWithCurrentTime(prependWithSpace(data)))
    })

    this._tailFile(this._systemFilePath, (data) => {
      if (data.includes(INVERSE_DOMAIN_PACKAGE_NAME)) {
        notifyOnErrorSubscribers(data)
      }
    })
  }

  onLog (level: string, cb: LogCallback): void {
    if (!this._subscribers[level]) {
      throw new Error(`Unknown process logging level: ${level}`)
    }

    this._subscribers[level].push(cb)
  }

  _notifySubscribersWithLog (level: string, data: mixed): void {
    for (let subscriberCallback of this._subscribers[level]) {
      subscriberCallback(data)
    }
  }

  _tailFile (filePath: string, subscriberCallback: LogCallback): void {
    this._tailFunction(filePath, subscriberCallback)
  }

  async _prepareLogFiles (): Promise<void> {
    await createFileIfMissing(this._stdoutPath)
    await createFileIfMissing(this._stderrPath)
  }
}

export default ClientLogSubscriber
export type { TailFunction }
