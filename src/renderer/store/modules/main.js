import type from '../types'

const state = {
  init: '',
  visual: 'head',
  error: null,
  navOpen: false,
  navVisible: true,
  showRequestErr: false
}

const getters = {
  loading: state => (state.init === type.INIT_PENDING),
  visual: state => state.visual,
  navOpen: state => state.navOpen,
  navVisible: state => state.navVisible,
  requestErr: state => state.error,
  showReqErr: state => state.showRequestErr
}

const mutations = {
  [type.SET_NAV_OPEN] (state, open) {
    state.navOpen = open
  },
  [type.SET_NAV_VISIBLE] (state, visible) {
    state.navVisible = visible
  },
  [type.SET_VISUAL] (state, visual) {
    state.visual = visual
  },
  [type.INIT_SUCCESS] (state) {
    state.init = type.INIT_SUCCESS
  },
  [type.INIT_PENDING] (state) {
    state.init = type.INIT_PENDING
  },
  [type.INIT_FAIL] (state, err) {
    state.init = type.INIT_FAIL
    state.error = err
  },
  [type.INIT_NEW_USER] (state) {
    state.newUser = true
  },
  [type.REQUEST_FAIL] (state, err) {
    state.error = err
    state.showRequestErr = true
  },
  [type.HIDE_REQ_ERR] (state) {
    state.showRequestErr = false
  }
}

const actions = {
  switchNav ({commit}, open) {
    commit(type.SET_NAV_OPEN, open)
  },
  setVisual ({commit}, visual) {
    commit(type.SET_VISUAL, visual)
  },
  setNavVisibility ({commit}, visible) {
    commit(type.SET_NAV_VISIBLE, visible)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
