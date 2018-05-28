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
import RendererMessageBus from '../../../app/communication/rendererMessageBus'
import RendererCommunication from '../../../app/communication/renderer-communication'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import IdentityDTO from '../../../libraries/mysterium-tequilapi/dto/identity'
import type {Container} from '../../../app/di'
import IdentityManager from '../../../app/identityManager'

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
  return {
    [type.IDENTITY_GET_SUCCESS] (state, identity: IdentityDTO) {
      state.current = identity
      bugReporter.setUser(identity)
      const messageBus = new RendererMessageBus()
      const communication = new RendererCommunication(messageBus)
      communication.sendCurrentIdentityChange(identity)
    },
    [type.IDENTITY_LIST_SUCCESS] (state, data) {
      state.identites = data
    },
    [type.IDENTITY_UNLOCK_SUCCESS] (state) {
      state.unlocked = true
    },
    [type.IDENTITY_UNLOCK_PENDING] (state) {
      state.unlocked = false
    },
    [type.IDENTITY_UNLOCK_FAIL] (state) {
      state.unlocked = false
    }
  }
}

const getters = {
  currentIdentity (state: Object): string {
    return state.current.id
  }
}

function actionsFactory (tequilapi: TequilapiClient) {
  const identityManager = new IdentityManager(tequilapi)
  return {
    async [type.IDENTITY_LIST] ({commit}): Promise<Array<IdentityDTO>> {
      return identityManager.listIdentities(commit)
    },
    async [type.IDENTITY_CREATE] ({commit}): Promise<IdentityDTO> {
      return identityManager.createIdentity(commit)
    },
    async [type.IDENTITY_UNLOCK] ({commit}): Promise<void> {
      await identityManager.unlockIdentity(commit, state)
    }
  }
}

function factory (tequilapi: TequilapiClient, dependenciesContainer: Container) {
  return {
    state,
    getters,
    mutations: mutationsFactory(dependenciesContainer),
    actions: actionsFactory(tequilapi)
  }
}

export {
  state,
  getters,
  mutationsFactory,
  actionsFactory
}
export type { State }
export default factory
