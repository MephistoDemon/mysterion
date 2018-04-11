import type from '../types'

const state = {
  overlay: null
}

const mutations = {
  [type.OVERLAY_ERROR] (state, { message, hint = null }) {
    state.overlay = { message, hint }
  }
}

const getters = {
  overlayError: (store) => store.overlay
}

const actions = {
  [type.OVERLAY_ERROR] ({commit}, { message, hint = null }) {
    commit(type.OVERLAY_ERROR, { message, hint })
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
