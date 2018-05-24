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

import Vue from 'vue'
import Vuex from 'vuex'
import ConnectionButton from '../../../../src/renderer/components/ConnectionButton'
import type from '../../../../src/renderer/store/types'
import ConnectionStatusEnum from '../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'
import {state, mutations, getters} from '@/store/modules/connection'

const mountWithStore = function () {
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
          [type.CONNECT] ({dispatch, commit}) {
            commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.CONNECTED)
          },
          [type.DISCONNECT] ({dispatch, commit}) {
            commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.NOT_CONNECTED)
          }
        }
      }
    }
  })

  const Constructor = Vue.extend(ConnectionButton)
  const vm = new Constructor({store,
    propsData: {
      providerId: 'dummy'
    }
  })

  return vm.$mount()
}

describe('ConnectionButton', () => {
  it('renders button text based on state', async () => {
    let rules = [
      ['NotConnected', 'Connect'],
      ['Connected', 'Disconnect'],
      ['Connecting', 'Cancel'],
      ['Disconnecting', 'Disconnecting']
    ]
    const vm = mountWithStore()
    for (let index in rules) {
      vm.$store.commit(type.SET_CONNECTION_STATUS, rules[index][0])
      vm._watcher.run()
      expect(vm.$el.textContent).to.eql(rules[index][1])
    }
    // reset store
    vm.$store.commit(type.SET_CONNECTION_STATUS, ConnectionStatusEnum.NOT_CONNECTED)
  })

  it('clicks change state', () => {
    const vm = mountWithStore()

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
