const state = {
  error: null,
  current: null
}

const mutations = {
  INIT_SUCCESS (state) { state.init = 'success' },
  INIT_PENDING (state) { state.init = 'pending' },
  INIT_FAIL (state, err) { state.init = 'fail'; state.error = err },
  REQUEST_FAIL (state, err) {
    state.error = err
  },
  IDENTITY_GET_SUCCESS (state, id) {
    state.current = id
  },
  IDENTITY_LIST_SUCCESS (state, data) {
    state.identites = data
  }
}

const getPassword = async () => ''

function factory (tequilapi) {
  const actions = {
    async identityCreate ({commit}) {
      try {
        const newIdentity = await tequilapi.identity.create(await getPassword())
        return newIdentity
      } catch (err) {
        commit('REQUEST_FAIL', err)
        throw (err)
      }
    },
    async identityList ({commit}) {
      try {
        const res = await tequilapi.identity.list()
        commit('IDENTITY_LIST_SUCCESS', res.identities)
        return res.identities
      } catch (err) {
        commit('REQUEST_FAIL', err)
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
