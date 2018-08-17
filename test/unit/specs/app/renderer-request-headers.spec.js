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
import { describe, it, expect, before } from '../../../helpers/dependencies'
import applyHeaderWrites from '../../../../src/app/window/requestHeaders'
import type { HeaderRule } from '../../../../src/app/window/requestHeaders'

let resultHeaders
let defaultHeaders

const fakeBrowserSession = {
  webRequest: {
    onBeforeSendHeaders: function (filter, callback) {
      callback(defaultHeaders, headers => {
        resultHeaders = headers
      })
    }
  }
}

describe('registerHeaderRules', () => {
  const customRules: Array<HeaderRule> = [
    {
      urls: ['some url'],
      write: function (headers) {
        headers['CustomHeader'] = 'FakeHeader'
        return headers
      }
    },
    {
      urls: ['some other url'],
      write: function (headers) {
        headers['CustomOtherHeader'] = 'FakeOtherHeader'
        return headers
      }
    }
  ]

  before(() => {
    defaultHeaders = { requestHeaders: {} }
  })

  it('applies given headers', () => {
    for (let rule of customRules) applyHeaderWrites(fakeBrowserSession, rule)
    expect(resultHeaders).to.be.eql({
      requestHeaders: {
        CustomHeader: 'FakeHeader',
        CustomOtherHeader: 'FakeOtherHeader'
      }
    })
  })
})
