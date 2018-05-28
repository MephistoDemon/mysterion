// @flow

import types from '../renderer/store/types'
import IdentityDTO from '../libraries/mysterium-tequilapi/dto/identity'
import type { TequilapiClient } from '../libraries/mysterium-tequilapi/client'
import type { State as IdentityState } from '../renderer/store/modules/identity'

const PASSWORD = ''

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
