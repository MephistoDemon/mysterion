// import tequilapi from '../../../api/tequilapi'

const tequilapi = require('../../../api/tequilapi')
const state = {
  uptime: ''
}

const mutations = {
  HEALTHCHECK (state, data) {
    state.uptime = data
  }
}

const actions = {
  healthcheck: async function ({commit}) {
    let data = tequilapi.healthcheck()
    commit('HEALTHCHECK', data)
  }
}

export default {
  state,
  mutations,
  actions
}
