/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import sinon from 'sinon'

import idStore from '@/store/modules/identity'
import propStore from '@/store/modules/proposal'
import mainStore from '@/store/modules/main'
import errorStore from '@/store/modules/errors'
import {tequilapi} from '@/../libraries/api/tequilapi'
import loadingScreen from '@/pages/VpnLoader'

import MockAdapter from 'axios-mock-adapter'
import config from '@/config'

Vue.use(Vuex)
Vue.use(Router)

const router = new Router({routes: []})
const mountVM = async (vm) => {
  await vm.$mount()
}

async function mountComponent (tequilapi) {
  const store = new Vuex.Store({
    modules: {
      identity: {...idStore(tequilapi)},
      proposal: {...propStore(tequilapi)},
      main: mainStore,
      errors: errorStore
    },
    strict: false
  })
  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {'test': loadingScreen},
    store,
    router
  })
  await mountVM(vm)
  return vm
}

describe('loading screen', () => {
  let mock
  let realDelay, clock

  async function mountAndPrepareLoadingScreen (tequilapi) {
    const vm = await mountComponent(tequilapi)
    await realDelay(10) // wait for delay inside loader
    clock.tick(config.loadingScreenDelay) // skip loader delay
    return vm
  }

  before(async () => {
    mock = new MockAdapter(tequilapi.__axio)
    mock.onGet('/healthcheck').reply(200, {version: {commit: 'caed3112'}})

    const realSetTimeout = setTimeout
    realDelay = time => new Promise(resolve => realSetTimeout(() => resolve(), time))
    clock = sinon.useFakeTimers()
  })

  after(() => {
    clock.restore()
    mock.reset()
  })

  describe('has some identities', () => {
    let vm
    before(async () => {
      mock.onGet('/identities').replyOnce(200, {identities: [{id: '0xC001FACE'}]})
      mock.onGet('/proposals').replyOnce(200, {proposals: [{id: '0xCEEDBEEF'}]})
      mock.onPut('/identities/0xC001FACE/unlock').reply(200)
      vm = await mountAndPrepareLoadingScreen(tequilapi)
    })

    it('loads without errors', async () => {
      expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
      expect(vm.$store.state.main.showError).to.eql(false)
    })
    it('assigns first fetched ID to state.tequilapi.currentId', () => {
      expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACE'})
    })
    it('stores proposal list in store', () => {
      expect(vm.$store.state.proposal.list).to.eql([{id: '0xCEEDBEEF'}])
    })
    it('routes to main', () => {
      expect(vm.$route.path).to.be.eql('/vpn')
    })
  })

  describe('has not found preset identities', () => {
    let vm
    before(async () => {
      mock.onGet('/identities').replyOnce(200, {identities: []})
      mock.onGet('/proposals').replyOnce(200, {proposals: [{id: '0xCEEDBEEF'}]})
      mock.onPost('/identities').replyOnce(200, {id: '0xC001FACY'})
      mock.onPut('/identities/0xC001FACY/unlock').replyOnce(200)
      vm = await mountAndPrepareLoadingScreen(tequilapi)
    })

    it('loads without errors', async () => {
      expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
      expect(vm.$store.state.main.showError).to.eql(false)
    })
    it('creates and unlocks identity', () => {
      expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACY'})
      expect(vm.$store.state.identity.unlocked).to.be.true
    })
    it('sets store.main.newUser true', () => {
      expect(vm.$store.state.main.newUser).to.be.true
    })
    it('routes to main', () => {
      expect(vm.$route.path).to.be.eql('/vpn')
    })
  })

  describe('error handling', () => {
    describe('generic', () => {
      let vm
      before(async () => {
        mock.onGet('/proposals').replyOnce(500)
        mock.onGet('/identities').replyOnce(500)
        vm = await mountComponent(tequilapi)
      })

      it('should notify user with an overlay', () => {
        expect(vm.$store.getters.overlayError).to.eql({
          message: 'Failed to initialize Mysterion'
        })
      })
    })

    describe('in proposals response body we get message: connect: network unreachable', () => {
      let vm
      before(async () => {
        mock.onGet('/proposals').replyOnce(500, {message: 'something connect: network is unreachable'})
        mock.onGet('/identities').replyOnce(200, {identities: [{id: '0xC001FACE'}]})
        mock.onPut('/identities/0xC001FACE/unlock').replyOnce(200)
        vm = await mountComponent(tequilapi)
      })

      it('should notify user with an overlay', () => {
        expect(vm.$store.getters.overlayError).to.eql({
          message: 'Can\'t connect to Mysterium Network',
          hint: 'Please check your internet connection.'
        })
      })
    })
  })
})
