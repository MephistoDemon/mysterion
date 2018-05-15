import {createLocalVue, mount} from '@vue/test-utils'
import CountrySelect from '@/components/CountrySelect'
import messages from '../../../../src/app/communication/messages'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import DIContainer from '../../../../src/app/di/vue-container'
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import {Store} from 'vuex'
import type from '@/store/types'
import translations from '@/../app/messages'

const communicationProposalsResponse = [
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

const bugReporterMock = {
  captureException: () => {}
}

function mountWith (rendererCommunication, store) {
  const vue = createLocalVue()

  const dependencies = new DIContainer(vue)
  dependencies.constant('rendererCommunication', rendererCommunication)
  dependencies.constant('bugReporter', bugReporterMock)

  return mount(CountrySelect, {
    localVue: vue,
    store
  })
}

describe('CountrySelect', () => {
  let wrapper

  const fakeMessageBus = new FakeMessageBus()

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

      wrapper = mountWith(new RendererCommunication(fakeMessageBus), store)
      fakeMessageBus.clean()
    })

    it(`commits ${translations.countryListIsEmpty} when empty proposal list is received`, async () => {
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, [])

      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$store.state.errorMessage).to.eql(translations.countryListIsEmpty)
    })
  })

  describe('when getting list of proposals', () => {
    beforeEach(() => {
      wrapper = mountWith(new RendererCommunication(fakeMessageBus))
      fakeMessageBus.clean()
    })

    it('renders a list item for each proposal', async () => {
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, communicationProposalsResponse)
      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.countriesList).to.have.lengthOf(4)
      expect(wrapper.findAll('.multiselect__option-title')).to.have.lengthOf(4)
      expect(wrapper.text()).to.contain('Lithuania')
      expect(wrapper.text()).to.contain('United Kingdom')
      expect(wrapper.text()).to.contain('N/A')
      expect(wrapper.text()).to.contain('N/A')
    })

    it('clicking an item changes v-model', async () => {
      const countryExpected = {
        label: 'Lithuania',
        id: '0x1',
        code: 'lt'
      }

      // initiate the click and check whether it opened the dropdown
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, communicationProposalsResponse)
      fakeMessageBus.send(messages.PROPOSALS_UPDATE)

      await wrapper.vm.fetchCountries()
      wrapper.find('.multiselect__option').trigger('click')

      expect(wrapper.emitted().selected).to.be.ok
      expect(wrapper.emitted().selected[0]).to.eql([countryExpected])
    })
  })
})
