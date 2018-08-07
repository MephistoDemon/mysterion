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
import {
  isTimeoutError,
  isRequestClosedError,
  isServiceUnavailableError,
  isHttpError, markErrorAsHttp
} from '../../../../src/libraries/mysterium-tequilapi/client-error'
import { describe, it, expect } from '../../../helpers/dependencies'

describe('errors', () => {
  describe('isHttpError', () => {
    it('indicates marked errors as http error', () => {
      const error = new Error('Mock error')
      expect(isHttpError(error)).to.eql(false)

      markErrorAsHttp(error)
      expect(isHttpError(error)).to.eql(true)
    })
  })

  describe('isTimeoutError()', () => {
    it('indicates timeout error', () => {
      let error = (new Error(): Object)
      error.code = 'ECONNABORTED'
      expect(isTimeoutError(error)).to.be.true

      error = new Error()
      expect(isTimeoutError(error)).to.be.false
    })
  })

  describe('isRequestClosedError()', () => {
    it('indicates request closed error', () => {
      let error = (new Error(): Object)
      error.response = { status: 499 }
      expect(isRequestClosedError(error)).to.be.true

      error = new Error()
      expect(isRequestClosedError(error)).to.be.false
    })
  })

  describe('isServiceUnavailableError()', () => {
    it('indicates service unavailable error', () => {
      let error = (new Error(): Object)
      error.response = { status: 503 }
      expect(isServiceUnavailableError(error)).to.be.true

      error = new Error()
      expect(isServiceUnavailableError(error)).to.be.false
    })
  })
})
