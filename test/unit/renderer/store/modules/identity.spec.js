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

import { describe, expect, it } from '../../../../helpers/dependencies'
import { getters } from '../../../../../src/renderer/store/modules/identity'
import type { State } from '../../../../../src/renderer/store/modules/identity'
import IdentityDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/identity'
import { captureError } from '../../../../helpers/utils'

describe('getters', () => {
  describe('currentIdentity', () => {
    it('returns id of identity', () => {
      const state: State = {
        current: new IdentityDTO({ id: 'identity id' }),
        unlocked: false
      }
      expect(getters.currentIdentity(state)).to.eql('identity id')
    })

    it('throws error when identity is not present', () => {
      const state: State = {
        current: null,
        unlocked: false
      }
      const error = captureError(() => getters.currentIdentity(state))
      if (!error) {
        throw new Error('Expected error not thrown')
      }
      expect(error).to.be.an('error')
      expect(error.message).to.eql('Trying to get identity which is not present')
    })
  })
})
