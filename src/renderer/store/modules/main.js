// @flow
// TODO: rename to `vpn.js` to be consistent with `Vpn.vue`
import type from '../types'
import TequilApi from '../../../libraries/api/client/tequil-api'

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
  [type.CLIENT_BUILD_INFO] (state, buildInfo: string) {
    state.clientBuildInfo = buildInfo
  },
  [type.SET_NAV_OPEN] (state, open) {
    state.navOpen = open
  },
  [type.SET_NAV_VISIBLE] (state, visible: boolean) {
    state.navVisible = visible
  },
  [type.SET_VISUAL] (state, visual: boolean) {
    state.visual = visual
  },
  [type.INIT_SUCCESS] (state) {
    state.init = type.INIT_SUCCESS
  },
  [type.INIT_PENDING] (state) {
    state.init = type.INIT_PENDING
  },
  [type.INIT_FAIL] (state, err: ?Error) {
    state.init = type.INIT_FAIL
    state.error = err
  },
  [type.INIT_NEW_USER] (state) {
    // TODO: remove if this is not used anywhere
    state.newUser = true
  },
  [type.SHOW_ERROR] (state, err) {
    state.showError = true
    if (err && err.response && err.response.data && err.response.data.message) {
      state.errorMessage = err.response.data.message
      return
    }
    if (err.message) {
      state.errorMessage = err.message
      return
    }
    state.errorMessage = 'Unknown error'
  },
  [type.SHOW_ERROR_MESSAGE] (state, errorMessage: string) {
    state.errorMessage = errorMessage
    state.showError = true
  },
  [type.HIDE_ERROR] (state) {
    state.showError = false
  }
}

function actionsFactory (tequilapi: TequilApi) {
  return {
    switchNav ({commit}, open: boolean) {
      commit(type.SET_NAV_OPEN, open)
    },
    setVisual ({commit}, visual: boolean) {
      commit(type.SET_VISUAL, visual)
    },
    async [type.CLIENT_BUILD_INFO] ({commit}) {
      const res = await tequilapi.healthCheck()
      commit(type.CLIENT_BUILD_INFO, res.version)
    },
    setNavVisibility ({commit}, visible: boolean) {
      commit(type.SET_NAV_VISIBLE, visible)
    }
  }
}

function factory (tequilapi: TequilApi) {
  return {
    state,
    mutations,
    getters,
    actions: actionsFactory(tequilapi)
  }
}

export {
  state,
  mutations,
  getters,
  actionsFactory
}
export default factory
