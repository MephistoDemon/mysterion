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
  [type.SET_NAV] (state, open) { state.navOpen = open },
  [type.SET_VISUAL] (state, visual) { state.visual = visual },
  [type.INIT_SUCCESS] (state) { state.init = type.INIT_SUCCESS },
  [type.INIT_PENDING] (state) { state.init = type.INIT_PENDING },
  [type.INIT_FAIL] (state, err) { state.init = type.INIT_FAIL; state.error = err },
  [type.INIT_NEW_USER] (state) { state.newUser = true }
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
