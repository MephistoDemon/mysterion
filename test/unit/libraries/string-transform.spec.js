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

import { describe, it, expect, beforeEach } from '../../helpers/dependencies'
import {
  applyTransformation,
  filterByString,
  getCurrentTimeISOFormat,
  prependWithFn
} from '../../../src/libraries/string-transform'
import { CallbackRecorder } from '../../helpers/utils'

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

describe('filterByString', () => {
  it('returns same string if filter matches', () => {
    expect(filterByString('a')('bald')).to.eql('bald')
  })
  it('returns nothing if filter doesn\'t match', () => {
    expect(filterByString('a')('bold')).to.be.undefined
  })
})

describe('applyTransformation', () => {
  let cbRec

  beforeEach(() => {
    cbRec = new CallbackRecorder()
  })

  it('runs transformation function and pipes its output to callback', () => {
    const transform = (data) => data + '+'
    
    applyTransformation(transform, cbRec.getCallback())('data')
    expect(cbRec.invoked).to.be.true
    expect(cbRec.argument).to.eql('data+')
  })

  it('does not call callback if transformation returns undefined or null', () => {
    const transformReturnNull = () => {
      return null
    }

    applyTransformation(transformReturnNull, cbRec.getCallback())('data')
    expect(cbRec.invoked).to.be.false
  })
})

describe('getCurrentTimeISOFormat', () => {
  const current = getCurrentTimeISOFormat()
  const ISORegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
  it('returns a valid ISO format', () => {
    expect(Date.parse(current)).to.not.be.NaN
    expect(current).to.match(ISORegex)
  })
})
