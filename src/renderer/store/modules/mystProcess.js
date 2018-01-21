const state = {
  log: '',
  err: ''
}

const mutations = {
  LOG_INFO (state, log) {
    console.log('[mystClient]: ' + log)
    state.log += log
  },
  LOG_ERROR (state, log) {
    console.log('[mystClientErr]: ' + log)
    state.err += log
  },
  HEALTHCHECK_SUCCESS (state, res) {
    state.running = true
    state.health = res
  },
  MYST_PROCESS_CLOSE () {
    state.running = false
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
    }
  }

  return {
    state,
    mutations,
    actions
  }
}

export default factory
