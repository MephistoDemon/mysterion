/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import lolex from 'lolex'

import errorStore from '@/store/modules/errors'
import {TequilapiFactory} from '@/../libraries/api/tequilapi'
import dependencies from '@/dependencies'
import axios from 'axios'
import VpnLoader from '@/pages/VpnLoader'

import utils from '../../../helpers/utils'
import MockAdapter from 'axios-mock-adapter'
import config from '@/config'
import messages from '../../../../src/app/messages'

Vue.use(Vuex)
Vue.use(Router)

const axioInstance = axios.create()
const tequilapi = TequilapiFactory(axioInstance)
dependencies.constant('tequilapi', tequilapi)
// using require here so that stores pick up mocked tequilapi
const idStore = require('@/store/modules/identity').default
const mainStore = require('@/store/modules/main').default

async function mountComponent () {
  const router = new Router({routes: []})
  const store = new Vuex.Store({
    modules: {
      identity: idStore,
      main: mainStore,
      errors: errorStore
    },
    strict: false
  })

  const vm = new Vue({
    template: '<div><test></test></div>',
    components: {'test': VpnLoader},
    store,
    router
  })
  await vm.$mount()

  return vm
}

describe('VpnLoader', () => {
  let mock
  let clock

  async function mountAndPrepareLoadingScreen () {
    const vm = await mountComponent()
    await utils.nextTick() // wait for delay inside loader callback
    clock.tick(config.loadingScreenDelay) // skip loader delay
    return vm
  }

  before(async () => {
    mock = new MockAdapter(axioInstance)
    mock.onGet('/healthcheck').reply(200, {version: {commit: 'caed3112'}})

    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
    mock.reset()
  })

  describe('has some identities', () => {
    let vm
    before(async () => {
      mock.onGet('/identities').replyOnce(200, {identities: [{id: '0xC001FACE'}]})
      mock.onPut('/identities/0xC001FACE/unlock').reply(200)
      vm = await mountAndPrepareLoadingScreen()
    })

    it('loads without errors', async () => {
      expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
      expect(vm.$store.state.main.showError).to.eql(false)
    })
    it('assigns first fetched ID to state.tequilapi.currentId', () => {
      expect(vm.$store.state.identity.current).to.eql({id: '0xC001FACE'})
    })
    it('routes to main', () => {
      expect(vm.$route.path).to.be.eql('/vpn')
    })
  })

  describe('has not found preset identities', () => {
    let vm
    before(async () => {
      mock.onGet('/identities').replyOnce(200, {identities: []})
      mock.onPost('/identities').replyOnce(200, {id: '0xC001FACY'})
      mock.onPut('/identities/0xC001FACE/unlock').reply(200)
      vm = await mountAndPrepareLoadingScreen()
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

  describe('identities error handling', () => {
    describe('identity listing failed', () => {
      let vm
      before(async () => {
        mock.onGet('/identities').replyOnce(500)
        vm = await mountComponent()
      })

      it('should notify user with an overlay', () => {
        expect(vm.$store.getters.overlayError).to.eql({
          message: messages.initializationError.message
        })
      })
    })

    describe('identity unlocking failed', () => {
      let vm
      before(async () => {
        mock.onGet('/identities').replyOnce(200, {identities: [{id: '0xC001FACE'}]})
        mock.onPut('/identities/0xC001FACE/unlock').replyOnce(500)
        vm = await mountComponent()
      })

      it('should notify user with an overlay', () => {
        expect(vm.$store.getters.overlayError).to.eql({
          message: messages.initializationError.message
        })
      })
    })
  })
})
