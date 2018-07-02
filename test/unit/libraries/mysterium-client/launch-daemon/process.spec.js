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

import { describe, expect, it } from '../../../../helpers/dependencies'
import Process from '../../../../../src/libraries/mysterium-client/launch-daemon/process'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import EmptyTequilapiClientMock from '../../../renderer/store/modules/empty-tequilapi-client-mock'

describe('Process', () => {
  describe('start()', () => {
    it('makes a request to given localhost port', async () => {
      const axiosMock = new MockAdapter(axios)
      let invoked = false
      axiosMock.onGet('http://127.0.0.1:1234').reply(() => {
        invoked = true
        return [200]
      })

      const tequilApi = new EmptyTequilapiClientMock()
      const process = new Process(tequilApi, 1234, '')
      await process.start()

      expect(invoked).to.be.true
    })
  })
})
