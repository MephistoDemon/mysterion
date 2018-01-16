import { expect } from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'

import router from '@/router'
import teqStore from '@/store/modules/tequilapi'
import loadingScreen from '@/components/LoadingScreen'
import tequilapi from '@/../api/tequilapi'

import MockAdapter from 'axios-mock-adapter'
import tequilastore from "../../../src/renderer/store/modules/tequilapi";

// import { testAction } from './helpers'

Vue.use(Vuex)

//const mock = new MockAdapter(tequilapi.__axio)

const nextTick = () => new Promise((resolve, reject) => Vue.nextTick(resolve))

// describe('loading screen action init', () => {
//   const {actions, state, dispatch } = tequilastore(tequilapi)
//   it('get identities', async () => {
//     await testAction(actions.fetchIdentity, null, {}, [
//       {type: 'SET_CURRENT_ID'}
//     ])
//   })
  // it('init', (done) => {
  //   testAction(actions.init, null, {}, [
  //     {type: 'SET_CURRENT_ID'}
  //   ], done)
  // })
// })

async function testActionAsync (action, payload, state, expectedMutations) {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (mutation.payload) {
        expect(payload).to.eql(mutation.payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  await action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
  }
}
// describe('loading screen', () => {
//
//   const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
//   const vm = new Vue({
//     template: '<div><test></test></div>',
//     components: { 'test': loadingScreen },
//     store,
//     router
//   })
//
//   describe('renders and fetches data', () => {
//     mock.onGet('/proposals').reply(200, {proposals: {}})
//     vm.$mount()
//     it('renders', (done) => {
//       expect(vm.$el.querySelector('.h1').textContent).to.equal('Loading')
//       done()
//     })
//     it('assigns first fetched ID to state.tequilapi.currentId', async () => {
//       await nextTick()
//       expect(vm.$store.state.tequilapi.currentId).to.eql({ id: '0xC001FACE' })
//     })
//     it('fetches & assigns proposals[] to state.tequilapi.proposals', (done) => {
//       expect(vm.$store.state.tequilapi.proposals).to.eql([ { id: '0xCEEDBEEF' } ])
//       done()
//     })
//     it('switches view', (done) => {
//       expect(vm.$route.path).to.eql('/main')
//       done()
//     })
//   })
// })

// describe('loading screen when no identities returned', () => {
//   const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
//   mock.reset()
//   mock.onGet('/identities').reply(200, {identities: []})
//   const vm = new Vue({
//     template: '<div><test></test></div>',
//     components: { 'test': loadingScreen },
//     store
//   })
//   describe('fetches identity', () => {
//     mock.onPut('/identities').reply(200, {identities: [{ id: '0xC001FACE' }]})
//     it('calls to create new identity and sets currentId', (done) => {
//       expect(vm.$store.state.tequilapi.currentId).to.eql({id: '0xC001FACE'})
//       done()
//     })
//   })
// })

// describe('loading screen failing to create new ID', () => {
//   const store = new Vuex.Store({modules: {tequilapi: {...teqStore(tequilapi)}}})
//   const vm = new Vue({
//     template: '<div><test></test></div>',
//     components: { 'test': loadingScreen },
//     store
//   })
//
//   it('sets state.tequilapi.error when account creation failed', async () => {
//     vm.$mount()
//     await nextTick()
//     expect(vm.$store.state.tequilapi.error.message).to.eql('Request failed with status code 404')
//   })
// })

