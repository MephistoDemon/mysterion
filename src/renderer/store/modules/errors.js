import type from '../types'

const state = {
  overlay: null
}

const mutations = {
  [type.OVERLAY_ERROR] (state, error) {
    state.overlay = error
  }
}

const getters = {
  overlayError: (store) => store.overlay
}

const actions = {
  [type.OVERLAY_ERROR] ({commit}, error) {
    commit(type.OVERLAY_ERROR, error)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
