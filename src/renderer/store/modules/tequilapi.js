import axios from 'axios'
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
    const res = await axios.get('127.0.0.1:4050/healthcheck')
    commit('HEALTHCHECK', res.data)
  }
}

export default {
  state,
  mutations,
  actions
}
