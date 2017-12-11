import {remote} from 'electron'
// import {spawn, execFileSync} from 'child_process'
var childProcess = require('child_process')

let mystProcess

const state = {
  status: 0,
  log: '',
  err: ''
}

const mutations = {
  LOG_INFO (state, log) {
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
  connect ({commit}, host) {
    mystProcess = childProcess.spawn(remote.getGlobal('__mysteriumClientBin'),
      ['--node', host, '-runtime-dir', remote.app.getPath('temp')])
    // TODO: should be userData as soon as mysterium_client fixes spaces in -runtime-dir issues
    mystProcess.stdout.on('data', (data) => {
      commit('LOG_INFO', data)
      commit('CONNECTED')
    })
    mystProcess.stderr.on('data', (data) => {
      commit('LOG_ERROR', data)
    })
    mystProcess.on('close', (code) => {
      commit('DISCONNECTED')
    })
  },
  kill ({commit}) {
    mystProcess.kill()
    commit('DISCONNECTED')
  }
}

export default {
  state,
  mutations,
  actions
}
