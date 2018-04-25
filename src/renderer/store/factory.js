import Vue from 'vue'
import Vuex from 'vuex'

import mainFactory from './modules/main'
import connectionFactory from './modules/connection'
import clientProcess from './modules/clientProcess'
import terms from './modules/terms'
import errors from './modules/errors'
import identityFactory from './modules/identity'

function factory (tequilapi, rendererCommunication, statsCollector) {
  Vue.use(Vuex)

  return new Vuex.Store({
    modules: {
      main: mainFactory(tequilapi),
      identity: identityFactory(tequilapi),
      connection: connectionFactory(tequilapi, rendererCommunication, statsCollector),
      errors,
      terms,
      clientProcess
    },
    strict: process.env.NODE_ENV !== 'production'
  })
}

export default factory
