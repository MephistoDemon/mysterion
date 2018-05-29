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

/**
 * Executes given function multiple times, until it succeeds.
 * Delays between execution.
 */
class DelayedRetrier {
  _func: () => Promise<void>
  _delay: () => Promise<void>
  _tries: number

  constructor (func: () => Promise<void>, delay: () => Promise<void>, tries: number) {
    this._func = func
    this._delay = delay
    this._tries = tries
  }

  async retryWithDelay () {
    for (let i = 0; true; ++i) {
      try {
        await this._func()
        return
      } catch (e) {
        if (i >= this._tries - 1) {
          throw e
        } else {
          await this._delay()
        }
      }
    }
  }
}

export default DelayedRetrier
