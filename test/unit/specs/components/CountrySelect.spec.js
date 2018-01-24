import Vue from 'vue'
import Vuex from 'vuex'
import CountrySelect from '../../../../src/renderer/components/CountrySelect'

const mountWithStore = function (list) {
  const store = new Vuex.Store({
    modules: {
      proposal: {
        state: {
          list: list
        }
      }
    }
  })
  const Constructor = Vue.extend(CountrySelect)
  const vm = new Constructor({store}).$mount()

  return vm
}
describe('CountrySelect', () => {
  const list = [
    {
      providerId: '0x1',
      serviceDefinition: {
        locationOriginate: {
          country: 'lt'
        }
      }
    },
    {
      providerId: '0x2',
      serviceDefinition: {
        locationOriginate: {
          country: 'gb'
        }
      }
    },
    {
      providerId: '0x3',
      serviceDefinition: {
        locationOriginate: {}
      }
    },
    {
      providerId: '0x4',
      serviceDefinition: {
        locationOriginate: {
          country: 'unknown'
        }
      }
    }
  ]

  it('renders a list item for each proposal', () => {
    const vm = mountWithStore(list)
    expect(vm.$el.querySelectorAll('.multiselect__option-title')).to.have.lengthOf(list.length)
    expect(vm.$el.textContent).to.contain('Lithuania')
    expect(vm.$el.textContent).to.contain('United Kingdom')
    expect(vm.$el.textContent).to.contain('0x3')
    expect(vm.$el.textContent).to.contain('N/A')
  })

  it('clicking an item changes v-model', () => {
    const vm = mountWithStore(list)
    const button = vm.$el.querySelector('.multiselect__option')
    const clickEvent = new window.Event('click')
    const selected = {
      label: 'Lithuania',
      id: '0x1',
      code: 'lt'
    }
    // initiate the click and check whether it opened the dropdown
    button.dispatchEvent(clickEvent)
    vm._watcher.run()
    expect(vm.country).to.include(selected)
  })
})
