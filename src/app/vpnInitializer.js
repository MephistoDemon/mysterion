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
import IdentityManager from './identityManager'
import type { TequilapiClient } from '../libraries/mysterium-tequilapi/client'
import type { State as IdentityState } from '../renderer/store/modules/identity'

/**
 * Creates or re-uses identity and unlocks it for future operations requiring identity.
 */
class VpnInitializer {
  _tequilapi: TequilapiClient

  constructor (tequilapi: TequilapiClient) {
    this._tequilapi = tequilapi
  }

  async initialize (dispatch: Function, commit: Function, state: IdentityState): Promise<void> {
    await this._prepareIdentity(commit, state)
    await dispatch(types.CLIENT_VERSION)
  }

  async _prepareIdentity (commit: Function, state: IdentityState): Promise<void> {
    const identityManager = new IdentityManager(this._tequilapi)

    const identity = await this._identityGet(identityManager, commit)
    commit(types.IDENTITY_GET_SUCCESS, identity)

    await identityManager.unlockIdentity(commit, state)
  }

  async _identityGet (identityManager: IdentityManager, commit: Function): Promise<IdentityDTO> {
    const identities = await identityManager.listIdentities(commit)

    if (identities && identities.length > 0) {
      return identities[0]
    }

    return identityManager.createIdentity(commit)
  }
}

export default VpnInitializer
