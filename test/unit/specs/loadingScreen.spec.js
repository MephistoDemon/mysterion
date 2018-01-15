import { expect } from 'chai'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router'

import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'

Vue.use(Vuex)

const nextTick = () => new Promise((resolve, reject) => Vue.nextTick(resolve))

const mockTeq = {
  getIdentities () {
    return new Promise((resolve, reject) => {
      resolve({data: {identities: [{id: 'ceedbeef'}]}})
    })
  },
  getProposals () {
    return new Promise((resolve, reject) => {
      resolve({data: {proposals: [{id: 1}]}})
    })
  }
}

const mockTeqNoIds = {
  ...mockTeq,
  getIdentities () {
    return new Promise((resolve, reject) => {
      resolve({data: {identities: []}})
    })
  },
  createIdentity (pwd) {
    return new Promise((resolve, reject) => {
      resolve({data: {id: '0xC001FACE'}})
    })
  }
}

const mockTeqNoIdsFailedCreation = {
  ...mockTeqNoIds,
  createIdentity(pwd) {
    return new Promise((resolve, reject) => {
      reject(new Error())
    })
  }
}

describe('loading screen', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(mockTeq)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store,
    router
  })

  describe('renders and fetches data', () => {
    vm.$mount()
    it('renders', (done) => {
      expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
      done()
    })
    it('assigns first fetched ID to state.tequilapi.currentId', (done) => {
      expect(vm.$store.state.tequilapi.currentId).to.eql({ id: 'ceedbeef' })
      done()
    })
    it('fetches & assigns proposals[] to state.tequilapi.proposals', (done) => {
      expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: 1 } ])
      done()
    })
    it('switches view', (done) => {
      expect(vm.$route.path).to.eql('/info')
      done()
    })
  })
})

describe('loading screen when no identities returned', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(mockTeqNoIds)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store
  })

  it('calls to create new identity and sets currentId', async () => {
    vm.$mount()
    await nextTick()
    expect(vm.$store.state.tequilapi.currentId).to.eql({id: '0xC001FACE'})
  })
})

describe('loading screen failing to create new ID', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(mockTeqNoIdsFailedCreation)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store
  })

  it('sets state.tequilapi.error when account creation failed', async () => {
    vm.$mount()
    await nextTick()
    expect(vm.$store.state.tequilapi.error.message).to.eql('Identity Creation Failed')
  })
})
