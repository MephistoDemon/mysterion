/* eslint-disable no-unused-expressions */
import {createLocalVue, mount} from '@vue/test-utils'
import CountrySelect from '@/components/CountrySelect'
import dependencies from '@/dependencies'

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

const tequilapi = {
  proposal: {
    list: () => {
      return Promise.resolve(tequilapiProposalsResponse)
    }
  }
}

describe('CountrySelect', () => {
  let wrapper

  beforeEach(() => {
    const vue = createLocalVue()
    dependencies.constant('tequilapi', tequilapi)
    vue.use(dependencies)
    wrapper = mount(CountrySelect, {
      localVue: vue
    })
  })

  it('renders a list item for each proposal', async () => {
    wrapper.vm.fetchCountries()
    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.countriesList).to.have.lengthOf(4)
    expect(wrapper.findAll('.multiselect__option-title')).to.have.lengthOf(4)
    expect(wrapper.text()).to.contain('Lithuania')
    expect(wrapper.text()).to.contain('United Kingdom')
    expect(wrapper.text()).to.contain('0x3')
    expect(wrapper.text()).to.contain('N/A')
  })

  it('clicking an item changes v-model', async () => {
    const countryExpected = {
      label: 'Lithuania',
      id: '0x1',
      code: 'lt'
    }

    // initiate the click and check whether it opened the dropdown
    await wrapper.vm.fetchCountries()
    wrapper.find('.multiselect__option').trigger('click')

    expect(wrapper.emitted().selected).to.be.ok
    expect(wrapper.emitted().selected[0]).to.eql([countryExpected])
  })
})
