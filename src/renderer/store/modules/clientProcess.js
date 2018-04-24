import type from '../types'

const state = {
  running: false
}

const mutations = {
  [type.MYST_PROCESS_RUNNING] (state, alive = false) {
    state.running = alive
  }
}

const getters = {
  clientIsRunning: (store) => store.running
}

const actions = {
  setClientRunningState ({commit}, clientIsRunning) {
    commit(type.MYST_PROCESS_RUNNING, clientIsRunning)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
