import type from '../types'

const state = {
  main: null
}

const mutations = {
  [type.ERROR_IN_MAIN] (state, error) {
    state.main = error
  }
}

const getters = {
  errorInMain: (store) => store.main
}

const actions = {
  [type.ERROR_IN_MAIN] ({commit}, error) {
    commit(type.ERROR_IN_MAIN, error)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
