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
import { applyTransformation, filterByString, prependWithFn } from '../../../src/libraries/string-transform'
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
  let called
  const cbRec1 = new CallbackRecorder()
  const cbRec2 = new CallbackRecorder()
  const transform = (data) => {
    if (!called) {
      called = true
      return data + '+'
    }
  }
  const transformReturnNull = () => {
  }

  it('runs transformation function and pipes its output to callback', () => {
    applyTransformation(transform, cbRec1.getCallback())('data')
    expect(cbRec1.invoked).to.be.true
    expect(cbRec1.argument).to.eql('data+')
  })

  it('does not call callback if transformation returns undefined or null', () => {
    applyTransformation(transformReturnNull, cbRec2.getCallback())('data')
    expect(cbRec2.invoked).to.be.false
  })
})
