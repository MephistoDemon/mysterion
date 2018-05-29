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

import types from '../renderer/store/types'
import IdentityDTO from '../libraries/mysterium-tequilapi/dto/identity'
import type { TequilapiClient } from '../libraries/mysterium-tequilapi/client'
import type { State as IdentityState } from '../renderer/store/modules/identity'

const PASSWORD = ''

/**
 * Allows managing identities using TequilapiClient and persisting data in identities module.
 */
class IdentityManager {
  _tequilapi: TequilapiClient

  constructor (tequilapi: TequilapiClient) {
    this._tequilapi = tequilapi
  }

  async listIdentities (commit: Function): Promise<Array<IdentityDTO>> {
    try {
      const identities = await this._tequilapi.identitiesList()
      commit(types.IDENTITY_LIST_SUCCESS, identities)
      return identities
    } catch (err) {
      commit(types.SHOW_ERROR, err)
      throw (err)
    }
  }

  async createIdentity (commit: Function): Promise<IdentityDTO> {
    try {
      return await this._tequilapi.identityCreate(PASSWORD)
    } catch (err) {
      commit(types.SHOW_ERROR, err)
      throw (err)
    }
  }

  async unlockIdentity (commit: Function, state: IdentityState): Promise<void> {
    try {
      if (state.current == null) {
        throw new Error('Identity is not available')
      }
      await this._tequilapi.identityUnlock(state.current.id, PASSWORD)
      commit(types.IDENTITY_UNLOCK_SUCCESS)
    } catch (err) {
      // TODO: throw error here as well for consistency?
      commit(types.SHOW_ERROR, err)
    }
  }
}

export default IdentityManager
