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
import { MainLogCachingTransport, MainLogCommunicationTransport } from './backend-logging-transports'
import type { MainCommunication } from '../communication/main-communication'

interface WinstonLogger {
  info: Function,
  warn: Function,
  error: Function,
  debug: Function,
  add: Function
}

export default class BackendLogger {
  _logger: WinstonLogger
  backendLogCache: LogCache
  mysteriumProcessLogCache: LogCache

  constructor (backendLogCache: LogCache, mysteriumProcessLogCache: LogCache) {
    this.backendLogCache = backendLogCache
    this.mysteriumProcessLogCache = mysteriumProcessLogCache

    this._logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new MainLogCachingTransport(this.backendLogCache)
      ]
    })
  }

  overrideConsoleLogs () {
    // $FlowFixMe
    console.log = (...args) => this._logger.info(args.join(' '))
    // $FlowFixMe
    console.info = (...args) => this._logger.info(args.join(' '))
    // $FlowFixMe
    console.warn = (...args) => this._logger.warn(args.join(' '))
    // $FlowFixMe
    console.error = (...args) => this._logger.error(args.join(' '))
    // $FlowFixMe
    console.debug = (...args) => this._logger.debug(args.join(' '))
  }

  sendCachedViaCommunication (com: MainCommunication) {
    for (const infoEntry of this.backendLogCache.get().info) {
      com.sendMysterionMainLog(infoEntry)
    }
    for (const errorEntry of this.backendLogCache.get().error) {
      com.sendMysterionMainLog(errorEntry)
    }
  }

  addMainCommunicationTransport (com: MainCommunication) {
    this._logger.add(new MainLogCommunicationTransport(com))
  }
}
