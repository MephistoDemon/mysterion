import mystProcess from '../../../main/mystProcess'

const state = {
  status: 0,
  log: '',
  err: ''
}

const mutations = {
  LOG_INFO (state, log) {
    console.log('log' + log)
    state.log += log
  },
  LOG_ERROR (state, log) {
    state.err += log
  },
  CONNECTED (state) {
    state.status = 1
  },
  DISCONNECTED (state) {
    state.status = 0
  }
}

const actions = {
  spawn ({commit}) {
    mystProcess.spawn(commit)
  },
  kill ({commit}) {
    mystProcess.kill(commit)
  }
}

export default {
  state,
  mutations,
  actions
}
