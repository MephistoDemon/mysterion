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

import {createLocalVue, mount} from '@vue/test-utils'
import CountrySelect from '@/components/CountrySelect'
import messages from '../../../../src/app/communication/messages'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import DIContainer from '../../../../src/app/di/vue-container'
import Vuex, {Store} from 'vuex'
import FakeMessageBus from '../../../helpers/fake-message-bus'
import Vue from 'vue'
import type from '@/store/types'
import translations from '@/../app/messages'
import { beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import BugReporterMock from '../../../helpers/bug-reporter-mock'

Vue.use(Vuex)

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

function mountWith (rendererCommunication, bugReporterMock, store) {
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

  let fakeMessageBus

  beforeEach(() => {
    fakeMessageBus = new FakeMessageBus()
  })

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

      const bugReporterMock = new BugReporterMock()
      wrapper = mountWith(new RendererCommunication(fakeMessageBus), bugReporterMock, store)
      fakeMessageBus.clean()
    })

    it(`commits ${translations.countryListIsEmpty} when empty proposal list is received`, async () => {
      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, [])

      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.$store.state.errorMessage).to.eql(translations.countryListIsEmpty)
    })
  })

  describe('.imagePath', () => {
    let bugReporterMock

    beforeEach(async () => {
      bugReporterMock = new BugReporterMock()
      wrapper = mountWith(new RendererCommunication(fakeMessageBus), bugReporterMock)
    })

    it('reports bug for unresolved country code', async () => {
      expect(bugReporterMock.infoMessages).to.have.lengthOf(0)
      wrapper.vm.imagePath('unknown')
      expect(bugReporterMock.infoMessages).to.have.lengthOf(1)
      expect(bugReporterMock.infoMessages[0].message).to.be.eql('Country not found, code: unknown')
    })

    it('does not send message to bug reporter on second try', async () => {
      expect(bugReporterMock.infoMessages).to.have.lengthOf(0)
      wrapper.vm.imagePath('unknown')
      wrapper.vm.imagePath('unknown')
      expect(bugReporterMock.infoMessages).to.have.lengthOf(1)
      expect(bugReporterMock.infoMessages[0].message).to.be.eql('Country not found, code: unknown')
    })

    it('does not send message to bug reporter known country code', async () => {
      expect(bugReporterMock.infoMessages).to.have.lengthOf(0)
      wrapper.vm.imagePath('lt')
      wrapper.vm.imagePath('gb')
      expect(bugReporterMock.infoMessages).to.have.lengthOf(0)
    })
  })

  describe('when getting list of proposals', () => {
    let bugReporterMock

    beforeEach(async () => {
      bugReporterMock = new BugReporterMock()
      wrapper = mountWith(new RendererCommunication(fakeMessageBus), bugReporterMock)
      fakeMessageBus.clean()

      fakeMessageBus.triggerOn(messages.PROPOSALS_UPDATE, communicationProposalsResponse)
      wrapper.vm.fetchCountries()
      await wrapper.vm.$nextTick()
      await wrapper.vm.$nextTick()
    })

    it('renders a list item for each proposal', async () => {
      expect(wrapper.vm.countryList).to.have.lengthOf(4)

      const multiselectOptions = wrapper.findAll('.multiselect__option-title')
      expect(multiselectOptions).to.have.lengthOf(4)

      const flags = wrapper.findAll('.multiselect__flag-svg')
      expect(flags.wrappers).to.have.lengthOf(4)

      // country code is known
      expect(multiselectOptions.wrappers[0].text()).to.contain('Lithuania (0x1)')
      expect(flags.wrappers[0].element.src).to.contain('/lt.svg')

      // country code is not defined
      expect(multiselectOptions.wrappers[1].text()).to.contain('N/A (0x3)')
      expect(flags.wrappers[1].element.src).to.contain('/world.svg')

      // country code is not resolved
      expect(multiselectOptions.wrappers[2].text()).to.contain('N/A un.. (0x4)')
      expect(flags.wrappers[2].element.src).to.contain('/world.svg')

      // country code is known
      expect(multiselectOptions.wrappers[3].text()).to.contain('United Kingdom (0x2)')
      expect(flags.wrappers[3].element.src).to.contain('/gb.svg')
    })

    it('clicking an item changes v-model', async () => {
      const countryExpected = {
        id: '0x1',
        code: 'lt',
        name: 'Lithuania'
      }

      // initiate the click and check whether it opened the dropdown
      fakeMessageBus.send(messages.PROPOSALS_UPDATE)

      wrapper.find('.multiselect__option').trigger('click')

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

    it('cleans all message bus callbacks after being destroyed', async () => {
      wrapper.destroy()
      expect(fakeMessageBus.noRemainingCallbacks()).to.be.true
    })
  })
})
