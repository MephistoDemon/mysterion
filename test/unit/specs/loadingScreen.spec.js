import { expect } from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'
import tequilapi from "@/../api/tequilapi";

import MockAdapter from 'axios-mock-adapter'

Vue.use(Vuex)

const mock = new MockAdapter(tequilapi.__axio)

const nextTick = () => new Promise((resolve, reject) => Vue.nextTick(resolve))

describe('loading screen', () => {
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store,
    router
  })

  describe('renders and fetches data', () => {
    mock.onGet('/identities').reply(200, { identities: [{ id: '0xC001FACE' }]})
    vm.$mount()

    it('renders', (done) => {
      expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
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
  const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})

  mock.reset()
  mock.onGet('/identities').reply(200, {identities: []})
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: { 'test': loadingScreen },
    store
  })

  describe('fetches identity', () => {
    mock.onPut('/identities').reply(200, { identities: [{ id: '0xC001FACE' }]})
    it('calls to create new identity and sets currentId', () => {
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
    vm.$mount()
    await nextTick()
    expect(vm.$store.state.tequilapi.error.message).to.eql('Request failed with status code 404')
  })
})
