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

import IdentityDTO from '../libraries/mysterium-tequilapi/dto/identity'
import types from '../renderer/store/types'

/**
 * Creates or re-uses identity and unlocks it for future operations requiring identity.
 */
class VpnInitializer {
  async initialize (dispatch: Function, commit: Function): Promise<void> {
    await this._prepareIdentity(dispatch, commit)
    await dispatch(types.CLIENT_BUILD_INFO)
  }

  async _prepareIdentity (dispatch: Function, commit: Function): Promise<void> {
    const identity = await this._identityGet(dispatch, commit)
    commit(types.IDENTITY_GET_SUCCESS, identity)
    await dispatch(types.IDENTITY_UNLOCK)
  }

  async _identityGet (dispatch: Function, commit: Function): Promise<IdentityDTO> {
    const identities = await dispatch(types.IDENTITY_LIST)
    if (identities && identities.length > 0) {
      return identities[0]
    }

    const newIdentity = await dispatch(types.IDENTITY_CREATE)
    commit(types.INIT_NEW_USER)
    return newIdentity
  }
}

export default VpnInitializer
