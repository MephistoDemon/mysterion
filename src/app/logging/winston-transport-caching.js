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
import type { WinstonLogEntry } from './winston'
import { mapWinstonLogLevelToMysterionLevel } from './winston'

class WinstonTransportCaching extends Transport {
  _logCache: LogCache
  constructor (logCache: LogCache) {
    super()
    this._logCache = logCache
  }

  log (logEntry: WinstonLogEntry, callback: () => any) {
    const timestamp = logEntry.timestamp || ''
    const message = timestamp + logEntry.message
    this._logCache.pushToLevel(mapWinstonLogLevelToMysterionLevel(logEntry.level), message)
    callback()
  }
}

export default WinstonTransportCaching
