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

import DelayedRetrier from '../../../src/app/delayedRetrier'
import { capturePromiseError } from '../../helpers/utils'
import { describe, expect, it } from '../../helpers/dependencies'

describe('DelayedRetrier', () => {
  describe('retryWithDelay()', () => {
    it('executes passing function', async () => {
      let invoked = false
      const func = async () => { invoked = true }
      const delay = async () => {}

      const retrier = new DelayedRetrier(func, delay, 1)
      await retrier.retryWithDelay()

      expect(invoked).to.be.true
    })

    it('fails with failing function', async () => {
      const mockError = new Error('mock error')
      let invoked = 0
      const func = async () => {
        invoked++
        throw mockError
      }
      const delay = async () => {}

      const retrier = new DelayedRetrier(func, delay, 3)
      const error = await capturePromiseError(retrier.retryWithDelay())

      expect(error).to.eql(mockError)
      expect(invoked).to.eql(3)
    })

    it('retries multiple times until success', async () => {
      const mockError = new Error('mock error')
      let invoked = 0
      const func = async () => {
        invoked++
        if (invoked <= 2) {
          throw mockError
        }
      }
      const delay = async () => {}

      const retrier = new DelayedRetrier(func, delay, 4)
      await retrier.retryWithDelay()

      expect(invoked).to.eql(3)
    })

    it('invokes delay function between retries', async () => {
      const mockError = new Error('mock error')
      let invoked = 0
      const func = async () => {
        invoked++
        if (invoked <= 2) {
          throw mockError
        }
      }
      const delayInvocations = []
      const delay = async () => {
        delayInvocations.push(invoked)
      }

      const retrier = new DelayedRetrier(func, delay, 3)
      await retrier.retryWithDelay()
      expect(delayInvocations).to.eql([1, 2])
    })
  })
})
