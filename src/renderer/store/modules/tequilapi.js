const state = {
  error: {
    message: 'ddd',
    request: {},
    response: {
      data: {}
    }
  },
  uptime: '',
  mystCli: {},
  currentId: ''
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

function factory (tequilapi) {
  const actions = {
    init ({commit}) {
      return new Promise(async (resolve, reject) => {
        try {
          const identitiesRes = await tequilapi.getIdentities()
          commit('SET_CURRENT_ID', identitiesRes.data.identities[0])
          const proposalsRes = await tequilapi.getProposals()
          commit('SET_PROPOSAL_LIST', proposalsRes.data.proposals)
          resolve()
        } catch (err) {
          commit('TEQUILAPI_FAILED_REQUEST', err)
          reject(err)
        }
      })
    },
    async getIdentities ({commit}) {
      try {
        const res = await tequilapi.getIdentities()
        commit('GOT_IDS', res.data)
      } catch (err) {
        commit('TEQUILAPI_FAILED_REQUEST', err)
        throw (err)
      }
    },
    async healthcheck ({commit}) {
      try {
        const res = await tequilapi.healthcheck()
        commit('HEALTHCHECK', res.data)
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
