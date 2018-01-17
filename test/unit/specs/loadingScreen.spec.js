import { expect } from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'
import tequilapi from '@/../api/tequilapi'

import MockAdapter from 'axios-mock-adapter'

Vue.use(Vuex)


const delay = (ms=0) => new Promise(resolve => setTimeout(resolve, ms))
const serialDelay = (ms=0) => { (async (ms) => { await delay(ms) })() } // async iife

const mountVM = async (vm) => await vm.$mount()

describe('loading screen', () => {
  const teq = tequilapi()
  const mock = new MockAdapter(teq.__axio)
  mock.onGet('/proposals').replyOnce(200, {proposals: [{ id: '0xCEEDBEEF' }]})
  mock.onGet('/identities').replyOnce(200, {identities: [{ id: '0xC001FACE' }]})
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(teq)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store,
    router
  })
  vm.$mount()
  serialDelay()

  describe('renders and fetches data', () => {

    it('renders', (done) => {
      expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
      expect(vm.$el.querySelector('.status').textContent).to.equal('success')
      done()
    })
    it('assigns first fetched ID to state.tequilapi.currentId', (done) => {
      expect(vm.$store.state.tequilapi.currentId).to.eql({ id: '0xC001FACE' })
      done()
    })
    it('fetches & assigns proposals[] to state.tequilapi.proposals', (done) => {
      expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: '0xCEEDBEEF' } ])
      done()
    })
    it('switches view', (done) => {
      expect(vm.$route.path).to.eql('/main')
      done()
    })
  })
})

describe('loading screen when no identities returned', () => {
  describe('fetches identity', () => {
    const teq = tequilapi()
    const mock = new MockAdapter(teq.__axio)
    const store = new Vuex.Store({modules: {tequilapi: {...teqStore(teq)}}})
   // mock.reset()
   // mock.onGet('/identities').reply(200, {identities: []})
   mock.onPut( '/identities').replyOnce(200, { id: '0xC001FACY' })

    const vm = new Vue({
      template: '<div><test></test></div>',
      components: { 'test': loadingScreen },
      store
    })
    vm.$mount()
    serialDelay()
    it('calls to create new identity and sets currentId', (done) => {
      console.log(vm.$store.state.tequilapi.currentId.id)
      expect(vm.$store.state.tequilapi.currentId).to.eql({id: '0xC001FACY'})
      done()
    })
  })
})

// describe('loading screen failing to create new ID', () => {
//   const mock = new MockAdapter(Object.assign({}, tequilapi.__axio))
//   const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
//   const vm = new Vue({
//     template: '<div><test></test></div>',
//     components: { 'test': loadingScreen },
//     store
//   })
//   vm.$mount()
//   serialDelay()
//
//   it('sets state.tequilapi.error when account creation failed', (done) => {
//     expect(vm.$store.state.tequilapi.error.message).to.eql('Request failed with status code 404')
//     done()
//   })
// })
