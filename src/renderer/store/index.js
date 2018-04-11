import Vue from 'vue'
import Vuex from 'vuex'
import dependencies from '../dependencies'

import mainFactory from './modules/main'
import connection from './modules/connection'
import clientProcess from './modules/clientProcess'
import terms from './modules/terms'
import errors from './modules/errors'
import identityFactory from './modules/identity'

Vue.use(Vuex)

const tequilapi = dependencies.get('tequilapi')

export default new Vuex.Store({
  modules: {
    main: mainFactory(tequilapi),
    identity: identityFactory(tequilapi),
    connection,
    errors,
    terms,
    clientProcess
  },
  strict: process.env.NODE_ENV !== 'production'
})
