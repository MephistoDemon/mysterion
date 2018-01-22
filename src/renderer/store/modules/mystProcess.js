import type from '../types'

const state = {
  log: '',
  err: ''
}

const mutations = {
  [type.LOG_INFO] (state, log) {
    console.log('[mystClient]: ' + log)
    state.log += log
  },
  [type.LOG_ERROR] (state, log) {
    console.log('[mystClientErr]: ' + log)
    state.err += log
  },
  [type.HEALTHCHECK_SUCCESS] (state, res) {
    state.running = true
    state.health = res
  },
  [type.MYST_PROCESS_CLOSE] () {
    state.running = false
  }
}

function factory (tequilapi) {
  const actions = {
    async healthcheck ({commit}) {
      try {
        const res = await tequilapi.get('/healthcheck')
        commit(type.HEALTHCHECK_SUCCESS, res)
        return res
      } catch (err) {
        commit(type.REQUEST_FAIL, err)
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
