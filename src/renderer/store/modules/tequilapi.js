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
    init ({commit}) {
      return new Promise(async (resolve, reject) => {
        try { // TODO: Untangle below
          const identityPromise = tequilapi.getIdentities().then((res) => {
            if (res.data.identities.length === 0) {
              tequilapi.createIdentity(getPassword()).then((res) => {
                commit('SET_CURRENT_ID', res.data)
              }, (res) => {
                // TODO: Try to make all errors uniform
                let err = new Error('Identity Creation Failed')
                err.res = res
                commit('TEQUILAPI_FAILED_REQUEST', err)
              })
            } else {
              commit('SET_CURRENT_ID', res.data.identities[0])
            }
          })
          const proposalsRes = await tequilapi.getProposals()
          commit('SET_PROPOSAL_LIST', proposalsRes.data.proposals)
          await identityPromise
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
