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

import Transport from 'winston-transport'
import type { MainCommunication } from '../communication/main-communication'
import LogCache from './log-cache'

type LogEntry = {
  level: string,
  message: string
}

export class BackendLogCommunicationTransport extends Transport {
  _communication: MainCommunication
  constructor (com: MainCommunication) {
    super()
    this._communication = com
  }

  log (info: LogEntry, callback: Function) {
    this._communication.sendMysterionBackendLog({ level: mapToCacheLevel(info.level), message: info.message })
    callback()
  }
}

export class BackendLogCachingTransport extends Transport {
  _logCache: LogCache
  constructor (logCache: LogCache) {
    super()
    this._logCache = logCache
  }

  log (info: LogEntry, callback: () => any) {
    this._logCache.pushToLevel(mapToCacheLevel(info.level), info.message)
    callback()
  }
}

function mapToCacheLevel (level: string): 'info' | 'error' {
  switch (level) {
    case 'error':
      return 'error'
    case 'info':
    case 'warn':
    case 'verbose':
    case 'debug':
    case 'silly':
    default:
      return 'info'
  }
}
