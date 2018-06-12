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
 * Allows subscribing callbacks and notifying them with data.
 */
class Subscriber<T> {
  _callbacks: Array<Callback<T>> = []

  subscribe (callback: Callback<T>) {
    this._callbacks.push(callback)
  }

  notify (data: T) {
    this._callbacks.forEach((callback: Callback<T>) => {
      callback(data)
    })
  }
}

type Callback<T> = (T) => any

export type { Callback }

export default Subscriber
