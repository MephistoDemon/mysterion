import type from '../types'

const state = {
  error: null,
  current: null
}

const mutations = {
  [type.REQUEST_FAIL] (state, err) {
    state.error = err
  },
  [type.IDENTITY_GET_SUCCESS] (state, id) {
    state.current = id
  },
  [type.IDENTITY_LIST_SUCCESS] (state, data) {
    state.identites = data
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
