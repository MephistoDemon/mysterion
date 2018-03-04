import type from '../types'
import {tequilapi} from '../../../api/tequilapi'

const state = {
  init: '',
  visual: 'head',
  error: null,
  navOpen: false,
  showRequestErr: false,
  buildInfo: {
    commit: ''
  }
}

const getters = {
  loading: state => (state.init === type.INIT_PENDING),
  visual: state => state.visual,
  navOpen: state => state.navOpen,
  requestErr: state => state.error,
  showReqErr: state => state.showRequestErr,
  buildInfo: state => state.buildInfo
}

const mutations = {
  [type.BUILD_INFO] (state, buildInfo) { state.buildInfo = buildInfo },
  [type.SET_NAV] (state, open) { state.navOpen = open },
  [type.SET_VISUAL] (state, visual) { state.visual = visual },
  [type.INIT_SUCCESS] (state) { state.init = type.INIT_SUCCESS },
  [type.INIT_PENDING] (state) { state.init = type.INIT_PENDING },
  [type.INIT_FAIL] (state, err) { state.init = type.INIT_FAIL; state.error = err },
  [type.INIT_NEW_USER] (state) { state.newUser = true },
  [type.REQUEST_FAIL] (state, err) { state.error = err; state.showRequestErr = true },
  [type.HIDE_REQ_ERR] (state) { state.showRequestErr = false }
}

const actions = {
  switchNav ({commit}, open) {
    commit(type.SET_NAV, open)
  },
  setVisual ({commit}, visual) {
    commit(type.SET_VISUAL, visual)
  },
  async [type.BUILD_INFO] ({commit}) {
    const res = await tequilapi.healthCheck()
    commit(type.BUILD_INFO, res.version)
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
