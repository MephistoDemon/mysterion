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
import LogCache from './log-cache'
import type { SyncRendererCommunication } from '../communication/sync/sync-communication'
import type { LogLevel } from './index'

type LogEntry = {
  level: string,
  message: string
}

export class SyncCommunicationTransport extends Transport {
  _communication: SyncRendererCommunication

  constructor (communication: SyncRendererCommunication) {
    super()
    this._communication = communication
  }

  log (info: LogEntry, callback: () => any) {
    const logDto = { level: mapToLogLevel(info.level), data: info.message }
    this._communication.sendLog(logDto)
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
    this._logCache.pushToLevel(mapToLogLevel(info.level), info.message)
    callback()
  }
}

function mapToLogLevel (level: string): LogLevel {
  switch (level) {
    case 'error':
      return 'error'
    case 'info':
    case 'warn':
    case 'debug':
    default:
      return 'info'
  }
}
