
const state = {
  error: {
    data: {},
    message: ''
  },
  uptime: '',
  processId: undefined,
  identites: []
}

const mutations = {
  TEQUILAPI_FAILED_REQUEST (state, data) {
    state.error.data = data
    state.error.message = 'Failed request to mysterium client'
  },
  HEALTHCHECK (state, data) {
    state.uptime = data.uptime
    state.processId = data.processIdt
  },
  GOT_IDS (state, data) {
    state.identites = data
  }
}

function factory (tequilapi) {
  const actions = {
    getIdentities: function ({commit}) {
      tequilapi.getIdentities().then(res => {
        commit('GOT_IDS', res.data)
      }, res => {
        commit('TEQUILAPI_FAILED_REQUEST', res)
      })
    },
    healthcheck: function ({commit}) {
      tequilapi.healthcheck().then((res) => {
        commit('HEALTHCHECK', res.data)
      })
    }
  }
  return {
    state,
    mutations,
    actions
  }
}

export default factory
