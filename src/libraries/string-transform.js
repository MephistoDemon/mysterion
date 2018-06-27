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

type TransformFn = (string) => ?string
type Callback = (string) => void

function applyTransformation (transform: TransformFn, next: Callback): (string) => void {
  return (data) => {
    const transformed = transform(data)
    if (transformed !== null && transformed !== undefined) {
      next(transformed)
    }
  }
}

function prependWithFn (fn: () => string): TransformFn {
  return (data: string) => {
    return fn() + data
  }
}

function filterByString (filter: string): TransformFn {
  const regex = new RegExp(filter)

  return (data: string) => {
    if (!regex.test(data)) {
      return
    }
    return data
  }
}

function getCurrentTimeISOFormat (): string {
  return new Date(Date.now()).toISOString()
}

export {
  applyTransformation,
  prependWithFn,
  filterByString,
  getCurrentTimeISOFormat
}
