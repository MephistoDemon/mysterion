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

import { describe, it, expect } from '../../helpers/dependencies'
import {
  getCurrentTimeISOFormat,
  prependWithFn,
  toISOString
} from '../../../src/libraries/strings'

describe.only('strings', () => {
  describe('prependWithFn', () => {
    it('prepends each time with fn execution result', () => {
      let calledTimes = 0
      const prependFn = () => {
        calledTimes += 1
        return calledTimes.toString()
      }
      const transform = prependWithFn(prependFn)
      expect(transform('data')).to.eql('1data')
      expect(transform('data')).to.eql('2data')
    })
  })

  describe('getCurrentTimeISOFormat', () => {
    const current = getCurrentTimeISOFormat()
    it('returns a string representing current time', () => {
      expect(Date.parse(current)).to.not.be.NaN
      expect(Date.parse(current)).to.be.string
    })
  })

  describe('toISOString', () => {
    const datetime = new Date(Date.parse('04 Dec 1995 00:12:00 GMT'))
    it('returns ISO formatted string from datetime number', () => {
      expect(toISOString(datetime)).to.eql('1995-12-04T00:12:00.000Z')
    })
  })
})
