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
import type from '../types'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import IdentityDTO from '../../../libraries/mysterium-tequilapi/dto/identity'
import type {Container} from '../../../app/di'

type State = {
  current: ?IdentityDTO,
  unlocked: boolean
}

const state: State = {
  current: null,
  unlocked: false
}

function mutationsFactory (dependencies: Container) {
  const bugReporter = dependencies.get('bugReporter')
  const rendererCommunication = dependencies.get('rendererCommunication')
  return {
    // TODO: rename to SET_CURRENT_IDENTITY
    [type.IDENTITY_GET_SUCCESS] (state, identity: IdentityDTO) {
      state.current = identity
      bugReporter.setUser(identity)
      rendererCommunication.sendCurrentIdentityChange(identity)
    },
    // TODO: rename to SET_IDENTITIES
    [type.IDENTITY_LIST_SUCCESS] (state, data) {
      state.identites = data
    },
    [type.IDENTITY_UNLOCK_SUCCESS] (state) {
      state.unlocked = true
    },
    [type.IDENTITY_UNLOCK_PENDING] (state) {
      state.unlocked = false
    },
    // TODO: remove duplicated mutation
    [type.IDENTITY_UNLOCK_FAIL] (state) {
      state.unlocked = false
    }
  }
}

const getters = {
  currentIdentity (state: State): string {
    const identity = state.current
    if (!identity) {
      throw new Error('Trying to get identity which is not present')
    }
    return identity.id
  }
}

function factory (tequilapi: TequilapiClient, dependenciesContainer: Container) {
  return {
    state,
    getters,
    mutations: mutationsFactory(dependenciesContainer)
  }
}

export {
  state,
  getters,
  mutationsFactory
}
export type { State }
export default factory
