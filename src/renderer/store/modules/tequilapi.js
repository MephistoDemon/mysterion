const state = {
  error: {
    message: '',
    request: {},
    response: {
      data: {}
    }
  },
  uptime: '',
  mystCli: {},
  currentId: '',
  proposals: []
}

const mutations = {
  SET_PROPOSAL_LIST (state, proposals) {
    state.proposals = proposals
  },
  SET_CURRENT_ID (state, id) {
    state.currentId = id
  },
  TEQUILAPI_FAILED_REQUEST (state, err) {
    state.error = err
  },
  HEALTHCHECK (state, data) {
    state.mystCli = {...state.mystCli, ...data} // object extend
  },
  GOT_IDS (state, data) {
    state.identites = data
  }
}

const getPassword = () => ''

function factory (tequilapi) {
  const actions = {
    async fetchIdentity ({dispatch, commit}) {
      const identities = await dispatch('getIdentities')
      if (identities.length !== 0) {
        commit('SET_CURRENT_ID', identities[0])
        return identities[0]
      } else {
        try {
          await dispatch('createIdentity')
        } catch (err) {
          commit('TEQUILAPI_FAILED_REQUEST', err)
          throw (err)
        }
      }
    },
    async createIdentity ({commit}) {
      try {
        const newIdentity = await tequilapi.post('/identities', getPassword())
        return newIdentity
      } catch (err) {
        commit('TEQUILAPI_FAILED_REQUEST', err)
        throw (err)
      }
    },
    async init ({dispatch, commit}) {
      try {
        const identityPromise = await dispatch('fetchIdentity')
        const proposals = await tequilapi.get('/proposals')
        commit('SET_CURRENT_ID', identityPromise)
        commit('SET_PROPOSAL_LIST', proposals.proposals)
        console.log(identityPromise)
        await identityPromise
      } catch (err) {
        commit('TEQUILAPI_FAILED_REQUEST', err)
        throw (err)
      }
    },
    async getIdentities ({commit}) {
      try {
        const res = await tequilapi.get('/identities')
        return res.identities
      } catch (err) {
        commit('TEQUILAPI_FAILED_REQUEST', err)
        throw (err)
      }
    },
    async healthcheck ({commit}) {
      try {
        const res = await tequilapi.get('/healthcheck')
        commit('HEALTHCHECK', res)
      } catch (err) {
        commit('TEQUILAPI_FAILED_REQUEST', err)
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
