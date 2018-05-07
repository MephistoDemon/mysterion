// @flow
import Vue from 'vue'
import Vuex from 'vuex'

function factory (modules: Object) {
  Vue.use(Vuex)

  return new Vuex.Store({
    modules: modules,
    strict: process.env.NODE_ENV !== 'production'
  })
}

export default factory
