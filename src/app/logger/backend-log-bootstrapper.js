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

import winston from 'winston'
import LogCache from './log-cache'
import BackendLogCachingTransport from './backend-log-transport'
import { winstonFormat } from './winston'
import logger from './index'

class BackendLogBootstrapper {
  _backendLogCache: LogCache

  constructor (backendLogCache: LogCache) {
    this._backendLogCache = backendLogCache
  }

  init () {
    const winstonLogger = winston.createLogger({
      format: winstonFormat,
      transports: [
        new winston.transports.Console(),
        new BackendLogCachingTransport(this._backendLogCache)
      ]
    })
    logger.setLogger(winstonLogger)
  }
}

export default BackendLogBootstrapper
