import Vue from 'vue'
import Vuex from 'vuex'
import ConnectionButton from '../../../../src/renderer/components/ConnectionButton'
import type from '../../../../src/renderer/store/types'
import conStore from '@/store/modules/connection'

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
        ...conStore,
        actions: {
          [type.CONNECT] ({commit}, consumerId, providerId) {
            commit(type.CONNECTION_STATUS, type.tequilapi.CONNECTED)
          },
          [type.DISCONNECT] ({commit}) {
            commit(type.CONNECTION_STATUS, type.tequilapi.NOT_CONNECTED)
          }
        }
      }
    }
  })
  const Constructor = Vue.extend(ConnectionButton)
  const vm = new Constructor({store}).$mount()

  return vm
}

describe('ConnectionButton', () => {
  it('renders button text based on state', () => {
    let rules = [
      ['NotConnected', 'Connect'],
      ['Connected', 'Disconnect'],
      ['Connecting', 'Connecting'],
      ['Disconnecting', 'Disconnecting']
    ]
    const vm = mountWithStore()
    for (let index in rules) {
      vm.$store.commit(type.CONNECTION_STATUS, rules[index][0])
      vm._watcher.run()
      expect(vm.$el.textContent).to.contain(rules[index][1])
    }
    // reset store
    vm.$store.commit(type.CONNECTION_STATUS, type.tequilapi.NOT_CONNECTED)
  })

  it('clicks change state', () => {
    const vm = mountWithStore()

    const clickEvent = new window.Event('click')
    const button = vm.$el.querySelector('.control__action')
    button.dispatchEvent(clickEvent)
    vm._watcher.run()
    console.log(vm.$store.state.connection.getters)
    expect(vm.$store.state.connection.status).to.equal('Connected')
    expect(vm.$el.textContent).to.contain('Disconnect')

    // handle disconnect
    button.dispatchEvent(clickEvent)
    vm._watcher.run()
    expect(vm.$el.textContent).to.contain('Connect')
  })
})
