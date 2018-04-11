import Vue from 'vue'
import Vuex from 'vuex'
import dependencies from '../dependencies'

import mainFactory from './modules/main'
import connection from './modules/connection'
import clientProcessFactory from './modules/clientProcess'
import terms from './modules/terms'
import errors from './modules/errors'
import identityFactory from './modules/identity'

Vue.use(Vuex)

const tequilapi = dependencies.get('tequilapi')

export default new Vuex.Store({
  modules: {
    main: mainFactory(tequilapi),
    connection,
    errors,
    terms,
    identity: identityFactory(tequilapi),
    clientProcess: clientProcessFactory(tequilapi)
  },
  strict: process.env.NODE_ENV !== 'production'
})
