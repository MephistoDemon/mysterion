import { expect } from 'chai'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'

Vue.use(Vuex)

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
    console.log('RESOLVING PROPOSALS')
    return new Promise((resolve, reject) => {
      resolve({data: {proposals: [{id: 1}]}})
    })
  }
}
const store = new Vuex.Store({modules: {tequilapi: {...teqStore(mockTeq)}}})
describe('loading screen', () => {
  it('should render', async () => {
    const vm = new Vue({
      template: '<div><test></test></div>',
      components: {
        'test': loadingScreen
      },
      store,
      router
    })
    vm.$mount()
    expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
    await nextTick()
    expect(vm.$store.state.tequilapi.currentId).to.eql({ id: 'ceedbeef' })
    await nextTick()
    expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: 1 } ])
    await nextTick()
    expect(vm.$route.path).to.eql('/info')
  })
})
