/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
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

import {createLocalVue, mount} from '@vue/test-utils'
import { beforeEach } from '../../../helpers/dependencies'
import Vpn from '../../../../src/renderer/pages/Vpn'
import Vuex, {Store} from 'vuex'
import DIContainer from '../../../../src/app/di/vue-container'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import messages from '../../../../src/app/communication/messages'
import type from '@/store/types'
import FakeMessageBus from '../../../helpers/fake-message-bus'
import translations from '@/../app/messages'
import Vue from 'vue'
Vue.use(Vuex)

const bugReporterMock = {
  captureErrorException: () => {}
}

describe('Vpn page', () => {
  let vpnWrapper
  let fakeMessageBus

  function mountWith (store) {
    const vue = createLocalVue()
    fakeMessageBus = new FakeMessageBus()
    const dependencies = new DIContainer(vue)
    dependencies.constant('rendererCommunication', new RendererCommunication(fakeMessageBus))
    dependencies.constant('bugReporter', bugReporterMock)

    // eslint-disable-next-line
    console.log(store.getters)
    return mount(Vpn, {
      localVue: vue,
      store: store
    })
  }

  beforeEach(() => {
    let store = new Store({
      getters: {
        connection () {},
        status () { return 'NotConnected' },
        ip () {},
        errorMessage () {},
        showError () {}
      }
    })
    vpnWrapper = mountWith(store)
  })
  it('mounts', () => {
    expect(vpnWrapper).to.be.ok
  })

  // TODO: move to VPN page
  describe('errors', () => {
    let store
    beforeEach(() => {
      store = new Store({
        getters: {
          connection () {},
          status () { return 'NotConnected' },
          ip () {},
          errorMessage () {},
          showError () {}
        },
        mutations: {
          [type.SHOW_ERROR] (state, error) {
            state.errorMessage = error.message
          }
        }
      })

      vpnWrapper = mountWith(store)
      fakeMessageBus.clean()
    })

    it(`commits ${translations.countryListIsEmpty} when empty proposal list is received`, async () => {
      fakeMessageBus.triggerOn(messages.COUNTRY_UPDATE, [])

      vpnWrapper.vm.fetchCountries()
      await vpnWrapper.vm.$nextTick()

      expect(vpnWrapper.vm.$store.state.errorMessage).to.eql(translations.countryListIsEmpty)
    })
  })
})
