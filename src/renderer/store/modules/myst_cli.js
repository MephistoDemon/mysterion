import mystProcess from '../../../main/mystProcess'

const state = {
  status: 0,
  log: '',
  err: ''
}

const mutations = {
  LOG_INFO (state, log) {
    console.log('[mystcli]: ' + log)
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

function factory (tequilapi) {
  const actions = {
    async healthcheck ({commit}) {
      try {
        const res = await tequilapi.get('/healthcheck')
        commit('HEALTHCHECK_SUCCESS', res)
        return res
      } catch (err) {
        commit('REQUEST_FAIL', err)
        throw (err)
      }
    },
    spawn ({commit}) {
      mystProcess.spawn(commit)
    },
    kill ({commit}) {
      mystProcess.kill(commit)
    }
  }

  return {
    state,
    mutations,
    actions
  }
}

export default factory
