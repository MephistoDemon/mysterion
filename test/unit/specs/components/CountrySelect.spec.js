import Vue from 'vue'
// eslint-disable-next-line import/no-webpack-loader-syntax
import CountrySelectInjector from '!!vue-loader?inject!@/components/CountrySelect'

const tequilapiProposalsResponse = {
  proposals: [
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
}
const tequilapiConstructor = (teqAddr) => {
  return {
    proposal: {
      list: () => {
        return tequilapiProposalsResponse
      }
    }
  }
}
const CountrySelect = CountrySelectInjector({
  '@/../libraries/api/tequilapi': tequilapiConstructor
})

describe('CountrySelect', () => {
  let vm
  before(function () {
    vm = new Vue(CountrySelect).$mount()
  })

  it('renders a list item for each proposal', async () => {
    vm.fetchCountries()
    await Vue.nextTick()
    await Vue.nextTick()
    expect(vm.countriesList).to.have.lengthOf(4)
    expect(vm.$el.querySelectorAll('.multiselect__option-title')).to.have.lengthOf(4)
    expect(vm.$el.textContent).to.contain('Lithuania')
    expect(vm.$el.textContent).to.contain('United Kingdom')
    expect(vm.$el.textContent).to.contain('0x3')
    expect(vm.$el.textContent).to.contain('N/A')
  })

  it('clicking an item changes v-model', async () => {
    const countryExpected = {
      label: 'Lithuania',
      id: '0x1',
      code: 'lt'
    }
    // initiate the click and check whether it opened the dropdown
    const button = vm.$el.querySelector('.multiselect__option')
    button.dispatchEvent(new window.Event('click'))
    expect(vm.country).to.include(countryExpected)
  })
})
