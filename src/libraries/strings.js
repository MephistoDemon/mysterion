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

function prependWithFn (fn: () => string): TransformFn {
  return (data: string) => {
    return fn() + data
  }
}

function filterByString (filter: string): TransformFn {
  return (data: string) => {
    if (!data.includes(filter)) {
      return
    }
    return data
  }
}

function getCurrentTimeISOFormat (): string {
  return toISOString(new Date())
}

function toISOString (date: Date): string {
  return date.toISOString()
}

export {
  prependWithFn,
  filterByString,
  getCurrentTimeISOFormat,
  toISOString
}
