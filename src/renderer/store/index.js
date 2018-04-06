import Vue from 'vue'
import Vuex from 'vuex'
import tequilAPI from '../../libraries/api/tequilapi'

import main from './modules/main'
import connection from './modules/connection'
import clientProcess from './modules/clientProcess'
import terms from './modules/terms'
import errors from './modules/errors'
import identity from './modules/identity'
Vue.use(Vuex)

const tequilapi = tequilAPI()

export default new Vuex.Store({
  modules: {
    main,
    connection,
    errors,
    terms,
    identity,
    clientProcess: clientProcess(tequilapi)
  },
  strict: process.env.NODE_ENV !== 'production'
})
