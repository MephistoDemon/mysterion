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

import type { StringLogger } from './logging/log-boostrapping'

class Logger {
  _frontendStringLogger: ?StringLogger = null

  // adds frontend logger, replacing standard console logs
  addFrontendLogger (logger: StringLogger): void {
    this._frontendStringLogger = logger
  }

  info (...data: Array<any>): void {
    if (!this._frontendStringLogger) {
      console.info(...data)
      return
    }
    this._frontendStringLogger.info(data.join(' '))
  }

  error (...data: Array<any>): void {
    if (!this._frontendStringLogger) {
      console.error(...data)
      return
    }
    this._frontendStringLogger.error(data.join(' '))
  }
}

const logger = new Logger()

export default logger
