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
    it('renders', () => {
      expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
      expect(vm.$el.querySelector('.status').textContent).to.equal('success')
    })
    it('assigns first fetched ID to state.tequilapi.currentId', () => {
      expect(vm.$store.state.tequilapi.currentId).to.eql({ id: '0xC001FACE' })
    })
    it('fetches & assigns proposals[] to state.tequilapi.proposals', () => {
      expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: '0xCEEDBEEF' } ])
    })
    it('switches view', () => {
      expect(vm.$route.path).to.eql('/main')
    })
  })
})
