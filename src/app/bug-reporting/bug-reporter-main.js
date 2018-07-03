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
import type {BugReporter} from './interface'
import Raven from 'raven'
import IdentityDTO from '../../libraries/mysterium-tequilapi/dto/identity'
import LogCache from '../logger/log-cache'

class BugReporterMain implements BugReporter {
  raven: Raven
  logCache: LogCache

  constructor (raven: Raven) {
    this.raven = raven
  }

  setUser (userData: IdentityDTO) {
    this.raven.setContext({
      user: userData
    })
  }

  captureErrorMessage (message: string, context: ?any): void {
    this._captureMessage(message, 'error', context)
  }

  captureInfoMessage (message: string, context: ?any): void {
    this._captureMessage(message, 'info', context)
  }

  captureErrorException (err: Error, context: ?any): void {
    this._captureException(err, 'error', context)
  }

  captureInfoException (err: Error, context: ?any): void {
    this._captureException(err, 'info', context)
  }

  _captureMessage (message: string, level: 'error' | 'info', context: ?any): void {
    this.raven.captureMessage(message, { level, extra: context })
  }

  _captureException (err: Error, level: 'error' | 'info', context: ?any): void {
    this.raven.captureException(err, { level, extra: context })
  }
}

export default BugReporterMain
