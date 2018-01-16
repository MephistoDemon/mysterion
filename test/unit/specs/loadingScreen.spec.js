import { expect } from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'
import tequilapi from '@/../api/tequilapi'

import MockAdapter from 'axios-mock-adapter'

Vue.use(Vuex)

const mock = new MockAdapter(tequilapi.__axio)

const mountVM = async (vm) => await vm.$mount()
describe('loading screen', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store,
    router
  })

  describe('renders and fetches data', () => {
    mock.onGet('/proposals').reply(200, {proposals: {}})
    mock.onGet('/identities').reply(200, {identities: { id: '0xC001FACE' }})

    it('renders', async () => {
      await mountVM(vm)
      expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
    })
    it('assigns first fetched ID to state.tequilapi.currentId', async () => {
      try{
        await mountVM(vm)
        expect(vm.$store.state.tequilapi.currentId).to.eql({ id: '0xC001FACE' })
      } catch (err){
        expect(err.message).to.be.undefined
      }
    })
    it('fetches & assigns proposals[] to state.tequilapi.proposals', async () => {
      await mountVM(vm)
      expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: '0xCEEDBEEF' } ])
    })
    it('switches view', async () => {
      await mountVM(vm)
      expect(vm.$route.path).to.eql('/main')
    })
  })
})

describe('loading screen when no identities returned', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
  mock.reset()
  mock.onGet('/identities').reply(200, {identities: []})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store
  })
  describe('fetches identity', () => {
    mock.onPut('/identities').reply(200, { id: '0xC001FACE' })
    it('calls to create new identity and sets currentId', (done) => {
      expect(vm.$store.state.tequilapi.currentId).to.eql({id: '0xC001FACE'})
      done()
    })
  })
})

describe('loading screen failing to create new ID', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store
  })

  it('sets state.tequilapi.error when account creation failed', async () => {
    await mountVM(vm)
    expect(vm.$store.state.tequilapi.error.message).to.eql('Request failed with status code 404')
  })
})
