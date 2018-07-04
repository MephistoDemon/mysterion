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

import type { StringLogger } from './string-logger'

class Logger {
  _logger: StringLogger = console

  // sets logger, replacing standard console logs
  setLogger (logger: StringLogger): void {
    this._logger = logger
  }

  info (...data: Array<any>): void {
    this._logger.info(data.join(' '))
  }

  error (...data: Array<any>): void {
    this._logger.error(data.join(' '))
  }
}

const logger = new Logger()

export default logger
