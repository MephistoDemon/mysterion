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

import Vuex from 'vuex'
import ConnectionButton from '../../../../src/renderer/components/ConnectionButton'
import type from '../../../../src/renderer/store/types'
import ConnectionStatusEnum from '../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'
import { state, mutations, getters } from '@/store/modules/connection'
import { createLocalVue, mount } from '@vue/test-utils'
import { describe, expect, it } from '../../../helpers/dependencies'

const mountWithStore = function () {
  const localVue = createLocalVue()
  localVue.use(Vuex)

  const store = new Vuex.Store({
    modules: {
      identity: {
        state: {
          current: {
            id: '0x1'
          }
        },
        getters: {
          currentIdentity (state) {
            return state.current.id
          }
        }
      },
      connection: {
        state,
        mutations,
        getters,
        actions: {
          [type.CONNECT] ({ dispatch, commit }) {
            commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.CONNECTED)
          },
          [type.DISCONNECT] ({ dispatch, commit }) {
            commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.NOT_CONNECTED)
          }
        }
      }
    }
  })

  return mount(ConnectionButton, {
    localVue: localVue,
    store,
    propsData: {
      providerId: 'dummy'
    }
  })
}

describe('ConnectionButton', () => {
  it('renders button text based on state', async () => {
    const rules = [
      ['NotConnected', 'Connect'],
      ['Connected', 'Disconnect'],
      ['Connecting', 'Cancel'],
      ['Disconnecting', 'Disconnecting']
    ]
    const wrapper = mountWithStore()
    const vm = wrapper.vm
    for (let rule of rules) {
      vm.$store.commit(type.SET_CONNECTION_STATUS, rule[0])
      vm._watcher.run()
      expect(vm.$el.textContent).to.eql(rule[1])
    }
    // reset store
    vm.$store.commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.NOT_CONNECTED)
  })

  it('clicks change state', () => {
    const wrapper = mountWithStore()
    const vm = wrapper.vm

    const clickEvent = new window.Event('click')
    const button = vm.$el.querySelector('.control__action')
    button.dispatchEvent(clickEvent)
    vm._watcher.run()
    expect(vm.$store.state.connection.status).to.equal('Connected')
    expect(vm.$el.textContent).to.eql('Disconnect')

    // handle disconnect
    button.dispatchEvent(clickEvent)
    vm._watcher.run()
    expect(vm.$el.textContent).to.eql('Connect')
  })
})
