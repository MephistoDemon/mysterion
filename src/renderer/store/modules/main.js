import type from '../types'

const state = {
  init: '',
  visual: 'head',
  error: {},
  navOpen: false
}

const getters = {
  loading: state => (state.init === type.INIT_PENDING),
  visual: state => state.visual,
  navOpen: state => state.navOpen
}

const mutations = {
  [type.INIT_SUCCESS] (state) {
    state.init = 'success'
  },
  [type.INIT_PENDING] (state) {
    state.init = 'pending'
  },
  [type.INIT_FAIL] (state, err) {
    state.init = 'fail'
    state.error = err
  },
  [type.SET_NAV] (state, open) {
    state.navOpen = open
  },
  [type.SET_VISUAL] (state, visual) {
    state.visual = visual
  }
}

const actions = {
  switchNav ({commit}, open) {
    commit(type.SET_NAV, open)
  },
  setVisual ({commit}, visual) {
    commit(type.SET_VISUAL, visual)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
