import type from '../types'

const state = {
  terms: {
    htmlContent: null
  }
}

const mutations = {
  [type.TERMS] (state, terms) {
    state.terms = terms
  }
}

const getters = {
  termsAndConditions: (store) => store.terms
}

const actions = {
  [type.TERMS] ({commit}, terms) {
    commit(type.TERMS, terms)
  }
}

export default {
  state,
  mutations,
  getters,
  actions
}
