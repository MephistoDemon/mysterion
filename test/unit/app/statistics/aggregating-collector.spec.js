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

import { newEvent } from '../../../../src/app/statistics/events'
import AggregatingCollector from '../../../../src/app/statistics/aggregating-collector'
import lolex from 'lolex'
import { nextTick } from '../../../helpers/utils'

describe('Aggregating collector', () => {
  let clock

  before(() => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  async function tickWithDelay (duration) {
    clock.tick(duration)
    await nextTick()
  }

  it('accumulates events', async () => {
    let event1 = newEvent('1', {})
    let event2 = newEvent('2', {})
    let mockCollector = {
      called: false,
      collectEvents: () => {
        this.called = true
        return Promise.resolve()
      }
    }
    let collector = new AggregatingCollector(mockCollector, 3)
    await collector.collectEvents(event1, event2)
    expect(collector._events).to.be.eql(
      [event1, event2]
    )
    expect(mockCollector.called).to.be.eql(false)
  })
  it('sends events to delegate, when event max is reached', async () => {
    let event1 = newEvent('1', {})
    let event2 = newEvent('2', {})
    let event3 = newEvent('3', {})
    let event4 = newEvent('4', {})
    let collectedEvents = []
    let mockCollector = {
      collectEvents: (...events) => {
        collectedEvents = events
        return Promise.resolve()
      }
    }
    let collector = new AggregatingCollector(mockCollector, 2)
    await collector.collectEvents(event1, event2, event3)
    expect(collectedEvents).to.be.eql(
      [event1, event2]
    )
    collectedEvents = []
    await collector.collectEvents(event4)
    expect(collectedEvents).to.be.eql(
      [event3, event4]
    )
  })
  it('flushes events after idle timeout', async () => {
    let collectedEvents = []
    let mockCollector = {
      collectEvents: (...events) => {
        collectedEvents = events
        return Promise.resolve()
      }
    }
    let collector = new AggregatingCollector(mockCollector, 2, 1)
    let event1 = newEvent('event1', {})
    await collector.collectEvents(event1)
    await tickWithDelay(500)
    expect(collectedEvents.length).to.be.equal(0)
    let event2 = newEvent('event2', {})
    await collector.collectEvents(event2)
    await tickWithDelay(2000)
    expect(collectedEvents).to.be.eql([event1, event2])
  })
})
