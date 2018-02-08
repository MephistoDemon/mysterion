import type from '../types'

const state = {
  running: false,
  quitting: false
}

const mutations = {
  [type.MYST_PROCESS_QUITTING] (state, quitting = false) {
    state.quitting = quitting
  },
  [type.MYST_PROCESS_ALIVE] (state, alive = false) {
    state.running = alive
  }
}

const getters = {
  isQuitting: (store) => store.quitting,
  isRunning: (store) => store.running
}

function factory (tequilApi) {
  const actions = {
    async healthCheck (context) {
      try {
        const res = await tequilApi.healthCheck({timeout: 500})
        context.commit(type.MYST_PROCESS_ALIVE, true)
        return res
      } catch (err) {
        context.commit(type.MYST_PROCESS_ALIVE, false)
        throw (err)
      }
    },
    quit ({commit}) {
      commit(type.MYST_PROCESS_QUITTING, true)
    }
  }

  return {
    state,
    mutations,
    getters,
    actions
  }
}

export default factory
