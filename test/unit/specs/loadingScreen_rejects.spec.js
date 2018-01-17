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


// THIS TEST SEEMS TO RACE WITH OTHER LOADING SCREEN.
// CURRENT_ID HERE IS 0xC00LFACE
// AND STATUS THERE IS FAILED
// describe('loading screen when no identities returned', () => {
//   describe('fetches identity', () => {
//     const teq = tequilapi()
//     const mock = new MockAdapter(teq.__axio)
//     const store = new Vuex.Store({modules: {tequilapi: {...teqStore(teq)}}})
//    // mock.reset()
//     mock.onGet('/identities').replyOnce(200, {identities: []})
//     mock.onPut('/identities').replyOnce(200, { id: '0xC001FACY' })
//
//     const vm = new Vue({
//       template: '<div><test></test></div>',
//       components: { 'test': loadingScreen },
//       store
//     })
//     vm.$mount()
//     serialDelay()
//
//     it('calls to create new identity and sets currentId', (done) => {
//       console.log(vm.$store.state.tequilapi.currentId.id)
//       expect(vm.$store.state.tequilapi.currentId).to.eql({id: '0xC001FACY'})
//       done()
//     })
//   })
// })

