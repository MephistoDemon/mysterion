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
import FakeMessageBus from '../../../helpers/fakeMessageBus'
import DisconnectNotificationSetting from '@/components/DisconnectNotificationSetting'

// TODO: extract this out to DRY with other occurances
function mountWith (rendererCommunication, store) {
  const vue = createLocalVue()

  const dependencies = new DIContainer(vue)
  dependencies.constant('rendererCommunication', rendererCommunication)

  return mount(DisconnectNotificationSetting, {
    localVue: vue,
    store
  })
}

describe('DisconnectNotificationSetting', () => {
  let wrapper

  const fakeMessageBus = new FakeMessageBus()

  describe('when getting list of proposals', () => {
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
})
