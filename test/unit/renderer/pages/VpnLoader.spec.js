// @flow
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import lolex from 'lolex'

import idStoreFactory from '@/store/modules/identity'
import mainStoreFactory from '@/store/modules/main'
import errorStore from '@/store/modules/errors'
import VpnLoader from '@/pages/VpnLoader'

import {nextTick} from '../../../helpers/utils'
import config from '@/config'
import messages from '../../../../src/app/messages'
import IdentityDTO from '../../../../src/libraries/mysterium-tequilapi/dto/identity'
import TequilapiClient from '../../../../src/libraries/mysterium-tequilapi/client'
import types from '@/store/types'
Vue.use(Vuex)
Vue.use(Router)

describe('VpnLoader', () => {
  let clock

  async function mountComponent (tequilapi: TequilapiClient): Vue {
    const router = new Router({routes: []})
    const store = new Vuex.Store({
      modules: {
        identity: idStoreFactory(tequilapi),
        main: mainStoreFactory(tequilapi),
        errors: errorStore,
        connection: {
          actions: {
            [types.LOCATION]: function () {}
          }
        }
      },
      strict: false
    })

    // TODO Migrate to createLocalVue() from package '@vue/test-utils'
    const vm = new Vue({
      template: '<div><test/></div>',
      components: {'test': VpnLoader},
      store,
      router
    })
    await vm.$mount()

    return vm
  }

  async function mountAndPrepareLoadingScreen (tequilapi: TequilapiClient) {
    const vm = await mountComponent(tequilapi)
    await nextTick() // wait for delay inside loader callback
    clock.tick(config.loadingScreenDelay) // skip loader delay
    return vm
  }

  function tequilapiMockCreate (version: string): TequilapiClient {
    const healtcheckResponse = {
      version: {
        commit: version
      }
    }

    return {
      healthCheck: () => Promise.resolve(healtcheckResponse)
    }
  }

  function tequilapiMockIdentitiesList (tequilapi: TequilapiClient, identities: Array<IdentityDTO>) {
    tequilapi.identitiesList = () => Promise.resolve(identities)
  }

  function tequilapiMockIdentitiesListError (tequilapi: TequilapiClient, error: Error) {
    tequilapi.identitiesList = () => Promise.reject(error)
  }

  function tequilapiMockIdentityCreate (tequilapi: TequilapiClient, identity: IdentityDTO) {
    tequilapi.identityCreate = () => Promise.resolve(identity)
  }

  function tequilapiMockIdentityUnlock (tequilapi: TequilapiClient) {
    tequilapi.identityUnlock = () => Promise.resolve()
  }

  function tequilapiMockIdentityUnlockError (tequilapi: TequilapiClient, error: Error) {
    tequilapi.identityUnlock = () => Promise.reject(error)
  }

  before(async () => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  describe('has some identities', () => {
    let vm
    before(async () => {
      const tequilapi = tequilapiMockCreate('caed3112')
      tequilapiMockIdentitiesList(tequilapi, [{id: '0xC001FACE'}])
      tequilapiMockIdentityUnlock(tequilapi)

      vm = await mountAndPrepareLoadingScreen(tequilapi)
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
      const tequilapi = tequilapiMockCreate('caed3112')
      tequilapiMockIdentitiesList(tequilapi, [])
      tequilapiMockIdentityCreate(tequilapi, {id: '0xC001FACY'})
      tequilapiMockIdentityUnlock(tequilapi)

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

  describe('identities error handling', () => {
    describe('identity listing failed', () => {
      let vm
      before(async () => {
        const tequilapi = tequilapiMockCreate('caed3112')
        tequilapiMockIdentitiesListError(tequilapi, new Error('Failed'))

        vm = await mountComponent(tequilapi)
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
        const tequilapi = tequilapiMockCreate('caed3112')
        tequilapiMockIdentitiesList(tequilapi, [{id: '0xC001FACE'}])
        tequilapiMockIdentityUnlockError(tequilapi, new Error('Failed'))

        vm = await mountComponent(tequilapi)
      })

      it('should notify user with an overlay', () => {
        expect(vm.$store.getters.overlayError).to.eql({
          message: messages.initializationError.message
        })
      })
    })
  })
})
