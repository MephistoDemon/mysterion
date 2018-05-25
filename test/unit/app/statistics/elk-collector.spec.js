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

import ElkCollector from '../../../../src/app/statistics/elk-collector'
import MockAdapter from 'axios-mock-adapter'
import {capturePromiseError} from '../../../helpers/utils'
import {newEvent} from '../../../../src/app/statistics/events'
import {describe, it} from '../../../helpers/dependencies'

describe('ElkCollector', () => {
  const elk = new ElkCollector('http://mocked.stuff')
  const axiosMock = new MockAdapter(elk._axiosApi)

  it('sends events to elk', async () => {
    const event1 = newEvent({}, 'event1', 123, {})
    const event2 = newEvent({}, 'event2', 123, {})
    axiosMock.onPost('/').reply(({url, data}) => {
      expect(url).to.be.eql('/')
      expect(JSON.parse(data)).to.be.eql([event1, event2])
      return [200, 'ok']
    })

    await elk.collectEvents(event1, event2)
  })

  it('catches ELK service errors', async () => {
    axiosMock.onPost('/').reply(() => [201, 'not ok'])

    const event = newEvent({}, 'event', 123, {})
    const error = await capturePromiseError(elk.collectEvents(event))
    expect(error).to.be.instanceOf(Error)
    expect(error).to.have.property('message', 'Invalid response from ELK service: 201 : not ok')
  })
})
