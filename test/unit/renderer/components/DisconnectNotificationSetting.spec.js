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

import {createLocalVue, mount} from '@vue/test-utils'
import RendererCommunication from '../../../../src/app/communication/renderer-communication'
import DIContainer from '../../../../src/app/di/vue-container'
import FakeMessageBus from '../../../helpers/fake-message-bus'
import DisconnectNotificationSetting from '@/components/DisconnectNotificationSetting'
import RendererMessageBus from '../../../../src/app/communication/renderer-message-bus'
import { nextTick } from '../../../helpers/utils'

// TODO: extract this out to DRY with other occurances
function mountWith (rendererCommunication) {
  const vue = createLocalVue()

  const dependencies = new DIContainer(vue)
  dependencies.constant('rendererCommunication', rendererCommunication)

  return mount(DisconnectNotificationSetting, {
    localVue: vue
  })
}

describe('DisconnectNotificationSetting', () => {
  // TODO: update message
  describe('when getting list of proposals', () => {
    const fakeMessageBus = new FakeMessageBus()
    let wrapper

    beforeEach(() => {
      const communication = new RendererCommunication(fakeMessageBus)
      wrapper = mountWith(communication)
      fakeMessageBus.clean()
    })

    it('cleans all message bus callbacks after being destroyed', async () => {
      wrapper.destroy()
      expect(fakeMessageBus.noRemainingCallbacks()).to.be.true
    })
  })

  describe('with real communication', () => {
    let communication

    beforeEach(() => {
      const realMessageBus = new RendererMessageBus()
      communication = new RendererCommunication(realMessageBus)
    })

    it('cleans message callbacks', async () => {
      const maxListenersLimit = 10

      let maxListenersExceeded = false

      process.on('warning', (warning) => {
        if (warning.name === 'MaxListenersExceededWarning') {
          maxListenersExceeded = true
        }
      })
      for (let i = 0; i < maxListenersLimit + 1; ++i) {
        const wrapper = mountWith(communication)
        wrapper.destroy()
      }
      await nextTick()
      expect(maxListenersExceeded).to.be.false
    })
  })
})
