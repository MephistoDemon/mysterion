const state = {
  init: '',
  error: {}
}

const mutations = {
  INIT_SUCCESS (state) { state.init = 'success' },
  INIT_PENDING (state) { state.init = 'pending' },
  INIT_FAIL (state, err) { state.init = 'fail'; state.error = err }
}

export default {
  state,
  mutations
}
