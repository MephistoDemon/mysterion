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

function factory () {
  const actions = {
    setClientRunningState ({commit}, clientIsRunning) {
      commit(type.MYST_PROCESS_RUNNING, clientIsRunning)
    }
  }

  return {
    state,
    mutations,
    getters,
    actions
  }
}

export default factory
