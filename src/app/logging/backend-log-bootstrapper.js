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
import { BackendLogCachingTransport } from './backend-logging-transports'

interface Logger {
  info (string): void,

  warn (string): void,

  error (string): void,

  debug (string): void,

  add (Transport): void
}

export default class BackendLogBootstrapper {
  _winstonLogger: Logger
  _backendLogCache: LogCache

  constructor (backendLogCache: LogCache) {
    this._backendLogCache = backendLogCache
  }

  init () {
    this._winstonLogger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
      transports: [
        new winston.transports.Console(),
        new BackendLogCachingTransport(this._backendLogCache)
      ]
    })
    overrideConsoleLogs(this._winstonLogger)
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
