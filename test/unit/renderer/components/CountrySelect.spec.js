/* eslint-disable no-unused-expressions */
import {createLocalVue, mount} from '@vue/test-utils'
import CountrySelect from '@/components/CountrySelect'
import DIContainer from '../../../../src/app/di/vue-container'
import {Store} from 'vuex'
import type from '@/store/types'
import messages from '@/../app/messages'

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
const tequilapiMockEmptyProposalArray = {
  proposal: {
    list: () => {
      return Promise.resolve({proposals: []})
    }
  }
}

const tequilapiMockThrows = {
  proposal: {
    list: () => {
      throw new Error('Anything')
    }
  }
}

const bugReporter = {
  renderer: {
    captureException: (error) => {
      console.log(error)
    }
  }
}
bugReporter.renderer.captureException.bind(bugReporter)

function mountWith (tequilapi, store) {
  const vue = createLocalVue()

  const dependencies = new DIContainer(vue)
  dependencies.constant('tequilapi', tequilapi)
  dependencies.constant('bugReporter', bugReporter)

  return mount(CountrySelect, {
    localVue: vue,
    store
  })
}

describe('CountrySelect', () => {
  describe('errors', () => {
    let store
    beforeEach(() => {
      store = new Store({
        mutations: {
          [type.SHOW_ERROR] (state, error) {
            state.errorMessage = error.message
          }
        }
      })
    })

    it(`commits ${messages.countryListIsEmpty} when empty proposal list is received`, async () => {
      const wrapper = mountWith(tequilapiMockEmptyProposalArray, store)

      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$store.state.errorMessage).to.eql(messages.countryListIsEmpty)
    })

    it(`commits ${messages.countryLoadingFailed} when proposal listing throws`, async () => {
      const wrapper = mountWith(tequilapiMockThrows, store)

      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$store.state.errorMessage).to.eql(messages.countryLoadingFailed)
    })
  })

  describe('when getting list of proposals', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mountWith(tequilapi)
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
})
