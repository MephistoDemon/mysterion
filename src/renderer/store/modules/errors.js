// @flow
import type from '../types'

type OverlayError = {
  message: string,
  hint: ?string
}

type State = {
  overlay: ?OverlayError
}

const state:State = {
  overlay: null
}

const mutations = {
  [type.OVERLAY_ERROR] (state: State, error: OverlayError) {
    state.overlay = error
  }
}

const getters = {
  overlayError: (store: Object) => store.overlay
}

const actions = {
  [type.OVERLAY_ERROR] ({commit}, error: OverlayError) {
    commit(type.OVERLAY_ERROR, error)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
