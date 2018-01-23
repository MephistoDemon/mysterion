import type from '../types'

const state = {
  error: null,
  current: null,
  unlocked: false
}

const mutations = {
  [type.REQUEST_FAIL] (state, err) {
    state.error = err
  },
  [type.IDENTITY_GET_SUCCESS] (state, identity) {
    state.current = identity // { id: '0xC001FACE00000123' }
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

const getPassword = async () => ''

function factory (tequilapi) {
  const actions = {
    async [type.IDENTITY_CREATE] ({commit}) {
      try {
        const newIdentity = await tequilapi.identity.create(await getPassword())
        return newIdentity
      } catch (err) {
        commit(type.REQUEST_FAIL, err)
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
        commit(type.REQUEST_FAIL, err)
      }
    },
    async [type.IDENTITY_LIST] ({commit}) {
      try {
        const res = await tequilapi.identity.list()
        commit(type.IDENTITY_LIST_SUCCESS, res.identities)
        return res.identities
      } catch (err) {
        commit(type.REQUEST_FAIL, err)
        throw (err)
      }
    }
  }

  return {
    state,
    mutations,
    actions
  }
}

export default factory
