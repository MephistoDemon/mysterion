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

import { createLocalVue, mount } from '@vue/test-utils'
import CountrySelect from '@/components/CountrySelect'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import DIContainer from '../../../../src/app/di/vue-container'
import FakeMessageBus from '../../../helpers/fake-message-bus'

const countryList = [
  {
    id: '0x1',
    code: 'lt',
    name: 'Lithuania'
  },
  {
    id: '0x2',
    code: 'gb',
    name: 'United Kingdom'
  },
  {
    id: '0x3',
    name: 'N/A'
  },
  {
    id: '0x4',
    name: 'N/A'
  }
]

const bugReporterMock = {
  captureErrorException: () => {
  }
}

function mountWith (rendererCommunication, store) {
  const vue = createLocalVue()

  const dependencies = new DIContainer(vue)
  dependencies.constant('rendererCommunication', rendererCommunication)
  dependencies.constant('bugReporter', bugReporterMock)

  return mount(CountrySelect, {
    localVue: vue,
    store,
    propsData: {
      countryList: countryList,
      fetchCountries: () => {},
      countriesAreLoading: false
    }
  })
}

describe('CountrySelect', () => {
  let wrapper

  const fakeMessageBus = new FakeMessageBus()

  describe('when getting list of proposals', () => {
    beforeEach(() => {
      wrapper = mountWith(new RendererCommunication(fakeMessageBus))
      fakeMessageBus.clean()
    })

    it('renders a list item for each proposal', async () => {
      expect(wrapper.vm.countryList).to.have.lengthOf(4)
      expect(wrapper.findAll('.multiselect__option-title')).to.have.lengthOf(4)
      expect(wrapper.text()).to.contain('Lithuania (0x1)')
      expect(wrapper.text()).to.contain('United Kingdom (0x2)')
      expect(wrapper.text()).to.contain('N/A (0x3)')
      expect(wrapper.text()).to.contain('N/A (0x4)')
    })

    it('clicking an item changes v-model', async () => {
      const countryExpected = {
        id: '0x1',
        code: 'lt',
        name: 'Lithuania'
      }

      // wrapper.find('.multiselect__option').trigger('click') // TODO: do this instead of vm.onChange() when the issue is resolved https://github.com/vuejs/vue-test-utils/issues/754
      wrapper.vm.onChange(countryExpected)
      expect(wrapper.emitted().selected).to.be.ok
      expect(wrapper.emitted().selected[0]).to.eql([countryExpected])
    })
  })

  describe('selectedCountryLabel()', () => {
    beforeEach(() => {
      wrapper = mountWith(new RendererCommunication(fakeMessageBus))
      fakeMessageBus.clean()
    })

    it('returns truncated long country name label', () => {
      const country = {
        name: 'The Democratic Republic of the Congo',
        id: '0x1234567890',
        code: 'cd'
      }

      const label = wrapper.vm.selectedCountryLabel(country)
      expect(label).to.be.eql('The Democr.. (0x1234567..)')
    })

    it('returns truncated short country name label', () => {
      const country = {
        name: 'Lithuania',
        id: '0x1234567890',
        code: 'lt'
      }

      const label = wrapper.vm.selectedCountryLabel(country)
      expect(label).to.be.eql('Lithuania (0x1234567..)')
    })
  })
})
