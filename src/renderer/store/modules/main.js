// TODO: rename to `vpn.js` to be consistent with `Vpn.vue`
import type from '../types'
import {tequilapi} from '../../../libraries/api/tequilapi'

const state = {
  init: '',
  visual: 'head',
  navOpen: false,
  clientBuildInfo: {},
  navVisible: true,
  errorMessage: null,
  showError: false
}

const getters = {
  loading: state => (state.init === type.INIT_PENDING),
  visual: state => state.visual,
  navOpen: state => state.navOpen,
  navVisible: state => state.navVisible && !(state.init === type.INIT_PENDING),
  clientBuildInfo: state => state.clientBuildInfo,
  errorMessage: state => state.errorMessage,
  showError: state => state.showError
}

const mutations = {
  [type.CLIENT_BUILD_INFO] (state, buildInfo) {
    state.clientBuildInfo = buildInfo
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
    // TODO: remove if this is not used anywhere
    state.newUser = true
  },
  [type.SHOW_ERROR] (state, err) {
    state.errorMessage = err.response ? err.response.data.message : err.message
    state.showError = true
  },
  [type.SHOW_ERROR_MESSAGE] (state, errorMessage) {
    state.errorMessage = errorMessage
    state.showError = true
  },
  [type.HIDE_ERROR] (state) {
    state.showError = false
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
