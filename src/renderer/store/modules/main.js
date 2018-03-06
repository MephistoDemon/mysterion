import type from '../types'
import {tequilapi} from '../../../libraries/api/tequilapi'

const state = {
  init: '',
  visual: 'head',
  error: null,
  navOpen: false,
  buildInfo: {
    commit: ''
  },
  navVisible: true,
  showRequestErr: false
}

const getters = {
  loading: state => (state.init === type.INIT_PENDING),
  visual: state => state.visual,
  navOpen: state => state.navOpen,
  navVisible: state => state.navVisible && !(state.init === type.INIT_PENDING),
  requestErr: state => state.error,
  showReqErr: state => state.showRequestErr,
  buildInfo: state => state.buildInfo
}

const mutations = {
  [type.CLIENT_BUILD_INFO] (state, buildInfo) {
    state.buildInfo = buildInfo
  },
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
  async [type.CLIENT_BUILD_INFO] ({commit}) {
    const res = await tequilapi.healthCheck()
    commit(type.CLIENT_BUILD_INFO, res.version)
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
