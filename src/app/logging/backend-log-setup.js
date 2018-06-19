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
import Transport from 'winston-transport'
import LogCache from './log-cache'
import { BackendLogCachingTransport, BackendLogCommunicationTransport } from './backend-logging-transports'
import type { MainCommunication } from '../communication/main-communication'

interface Logger {
  info (string): void,

  warn (string): void,

  error (string): void,

  debug (string): void,

  add (Transport): void
}

export default class BackendLogSetup {
  winstonLogger: Logger
  backendLogCache: LogCache
  mysteriumProcessLogCache: LogCache

  constructor (backendLogCache: LogCache, mysteriumProcessLogCache: LogCache) {
    this.backendLogCache = backendLogCache
    this.mysteriumProcessLogCache = mysteriumProcessLogCache
  }

  init () {
    this.winstonLogger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new BackendLogCachingTransport(this.backendLogCache)
      ]
    })
    overrideConsoleLogs(this.winstonLogger)
  }

  startSendingLogsViaCommunication (com: MainCommunication) {
    this._sendCachedViaCommunication(com)
    this._addBackendCommunicationTransport(com)
  }

  _sendCachedViaCommunication (com: MainCommunication) {
    for (const infoEntry of this.backendLogCache.get().info) {
      com.sendMysterionBackendLog(infoEntry)
    }
    for (const errorEntry of this.backendLogCache.get().error) {
      com.sendMysterionBackendLog(errorEntry)
    }
  }

  _addBackendCommunicationTransport (com: MainCommunication) {
    this.winstonLogger.add(new BackendLogCommunicationTransport(com))
  }
}

function overrideConsoleLogs (logger: Logger) {
  // $FlowFixMe
  console.log = (...args) => logger.info(args.join(' '))
  // $FlowFixMe
  console.info = (...args) => logger.info(args.join(' '))
  // $FlowFixMe
  console.warn = (...args) => logger.warn(args.join(' '))
  // $FlowFixMe
  console.error = (...args) => logger.error(args.join(' '))
  // $FlowFixMe
  console.debug = (...args) => logger.debug(args.join(' '))
}
