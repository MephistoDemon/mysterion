import type from '../types'

const state = {
  init: '',
  error: {}
}

const mutations = {
  [type.INIT_SUCCESS] (state) { state.init = 'success' },
  [type.INIT_PENDING] (state) { state.init = 'pending' },
  [type.INIT_FAIL] (state, err) { state.init = 'fail'; state.error = err },
  [type.INIT_NEW_USER] (state) { state.newUser = true }
}

export default {
  state,
  mutations
}
