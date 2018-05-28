/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import {expect} from 'chai'

import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import lolex from 'lolex'
import {createLocalVue, mount} from '@vue/test-utils'

import idStoreFactory from '@/store/modules/identity'
import mainStoreFactory from '@/store/modules/main'
import errorStore from '@/store/modules/errors'
import VpnLoader from '@/pages/VpnLoader'

import {nextTick} from '../../../helpers/utils'
import {describe, it, before, after} from '../../../helpers/dependencies'
import config from '@/config'
import messages from '../../../../src/app/messages'
import types from '@/store/types'
import type { TequilapiClient } from '../../../../src/libraries/mysterium-tequilapi/client'

import DIContainer from '../../../../src/app/di/vue-container'

describe('VpnLoader', () => {
  let clock
  const tequilapi: TequilapiClient = tequilapiMockCreate()

  async function mountComponent (tequilapi: TequilapiClient, vpnInitializer: Object): Vue {
    const localVue = createLocalVue()

    const dependencies = new DIContainer(localVue)
    dependencies.constant('bugReporter', {setUser: function () {}})
    dependencies.constant('vpnInitializer', vpnInitializer)

    localVue.use(Router)
    const router = new Router({routes: []})

    localVue.use(Vuex)
    const store = new Vuex.Store({
      modules: {
        identity: idStoreFactory(tequilapi, dependencies),
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

    const wrapper = mount(VpnLoader, { localVue, store, router })
    return wrapper.vm
  }

  async function mountAndPrepareLoadingScreen (tequilapi: TequilapiClient, vpnInitializer: Object) {
    const vm = await mountComponent(tequilapi, vpnInitializer)
    await nextTick() // wait for delay inside loader callback
    clock.tick(config.loadingScreenDelay) // skip loader delay
    return vm
  }

  function tequilapiMockCreate (): Object {
    return {}
  }

  before(async () => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  describe('when initialization succeeds', () => {
    let vm

    before(async () => {
      const vpnInitializer = {
        async initialize (..._args: Array<any>): Promise<void> {}
      }

      vm = await mountAndPrepareLoadingScreen(tequilapi, vpnInitializer)
    })

    it('loads without errors', async () => {
      expect(vm.$store.state.main.init).to.eql('INIT_SUCCESS')
      expect(vm.$store.state.main.showError).to.eql(false)
    })

    it('routes to main', () => {
      expect(vm.$route.path).to.be.eql('/vpn')
    })
  })

  describe('when initialization fails', () => {
    let vm

    before(async () => {
      const vpnInitializer = {
        async initialize (..._args: Array<any>): Promise<void> {
          throw new Error('Mock initialization error')
        }
      }

      vm = await mountComponent(tequilapi, vpnInitializer)
    })

    it('notifies user with an overlay', () => {
      expect(vm.$store.getters.overlayError).to.eql({
        message: messages.initializationError.message
      })
    })
  })
})
