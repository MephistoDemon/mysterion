
const state = {
  uptime: ''
}

const mutations = {
  HEALTHCHECK (state, data) {
    state.uptime = data.uptime
  },
  GOT_IDS (state, data) {
    state.identites = data.identities
  }
}

function factory (tequilapi) {
  const actions = {
    getIdentities: async function ({commit}) {
      const data = await tequilapi.getIdentities()
      commit('GOT_IDS', data)
    },
    healthcheck: function ({commit}) {
      tequilapi.healthcheck().then((data) => {
        commit('HEALTHCHECK', data)
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
