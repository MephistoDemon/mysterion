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
import TequilapiClient from '../../../libraries/mysterium-tequilapi/client'
import IdentityDTO from '../../../libraries/mysterium-tequilapi/dto/identity'
import type {Container} from '../../../app/di'

const state = {
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

async function getPassword (): Promise<string> {
  return ''
}

function actionsFactory (tequilapi: TequilapiClient) {
  return {
    async [type.IDENTITY_CREATE] ({commit}) {
      try {
        return await tequilapi.identityCreate(await getPassword())
      } catch (err) {
        commit(type.SHOW_ERROR, err)
        throw (err)
      }
    },
    async [type.IDENTITY_UNLOCK] ({commit}) {
      try {
        await tequilapi.identityUnlock(state.current.id, await getPassword())
        commit(type.IDENTITY_UNLOCK_SUCCESS)
      } catch (err) {
        commit(type.SHOW_ERROR, err)
      }
    },
    async [type.IDENTITY_LIST] ({commit}) {
      try {
        const identities = await tequilapi.identitiesList()
        commit(type.IDENTITY_LIST_SUCCESS, identities)
        return identities
      } catch (err) {
        commit(type.SHOW_ERROR, err)
        throw (err)
      }
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
export default factory
