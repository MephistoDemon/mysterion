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
