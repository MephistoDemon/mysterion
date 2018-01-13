import { expect } from 'chai'
import Vue from 'vue'
import Vuex from 'vuex'

import store_ from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'
Vue.use(Vuex)

// const ExampleInjector = require('!!vue-loader?inject!@/store/modules/')

function nextTick () {
  return new Promise((resolve, reject) => Vue.nextTick(resolve))
}
const mockTeq = {
  getIdentities() {
    return new Promise((resolve, reject) => {
      resolve({data: {identities: [{id: 'ceedbeef'}]}})
    })
  },
  getProposals() {
    return new Promise((resolve, reject) => {
      resolve({data: {identities: [{id: 'ceedbeef'}]}})
    })
  }
}
const store = new Vuex.Store({modules: {tequilapi: {...store_(mockTeq)}}})
describe('loading screen', () => {
  it('should render', async () => {
    const vm = new Vue({
      template: '<div><test></test></div>',
      components: {
        'test': loadingScreen
      },
      store: store
    }).$mount()
    expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
    await nextTick()
    expect(vm.$store.state.tequilapi.currentId).to.eql({ id: 'ceedbeef' })
  })
})
