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
  _dispatch: Function
  _commit: Function

  constructor (dispatch: Function, commit: Function) {
    this._dispatch = dispatch
    this._commit = commit
  }

  async initialize (): Promise<void> {
    await this._prepareIdentity()
    await this._dispatch(types.CLIENT_BUILD_INFO)
  }

  async _prepareIdentity (): Promise<void> {
    const identity = await this._identityGet()
    this._commit(types.IDENTITY_GET_SUCCESS, identity)
    await this._dispatch(types.IDENTITY_UNLOCK)
  }

  async _identityGet (): Promise<IdentityDTO> {
    const identities = await this._dispatch(types.IDENTITY_LIST)
    if (identities && identities.length > 0) {
      return identities[0]
    }

    const newIdentity = await this._dispatch(types.IDENTITY_CREATE)
    this._commit(types.INIT_NEW_USER)
    return newIdentity
  }
}

export default VpnInitializer
