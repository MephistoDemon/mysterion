import type from '../types'
import reporter from '../../../app/bug-reporting'
import {ipcRenderer} from 'electron'
import message from '../../../app/communication'

const state = {
  current: null,
  unlocked: false
}

const mutations = {
  [type.IDENTITY_GET_SUCCESS] (state, identity) {
    state.current = identity // { id: '0xC001FACE00000123' }
    reporter.setUser(identity)
    ipcRenderer.send(message.IDENTITY_SET, identity)
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

const getters = {
  currentIdentity (state) {
    return state.current.id
  }
}

const getPassword = async () => ''

function factory (tequilapi) {
  const actions = {
    async [type.IDENTITY_CREATE] ({commit}) {
      try {
        const newIdentity = await tequilapi.identity.create(await getPassword())
        return newIdentity
      } catch (err) {
        commit(type.SHOW_ERROR, err)
        throw (err)
      }
    },
    async [type.IDENTITY_UNLOCK] ({commit}) {
      try {
        const res = await tequilapi.identity.unlock({
          id: state.current.id,
          passphrase: await getPassword()
        })
        commit(type.IDENTITY_UNLOCK_SUCCESS, res)
      } catch (err) {
        commit(type.SHOW_ERROR, err)
      }
    },
    async [type.IDENTITY_LIST] ({commit}) {
      try {
        const res = await tequilapi.identity.list()
        commit(type.IDENTITY_LIST_SUCCESS, res.identities)
        return res.identities
      } catch (err) {
        commit(type.SHOW_ERROR, err)
        throw (err)
      }
    }
  }

  return {
    state,
    mutations,
    actions,
    getters
  }
}

export default factory
