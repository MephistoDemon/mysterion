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

import { describe, expect, it } from '../../../helpers/dependencies'
import StartupEventTracker from '../../../../src/app/statistics/startup-event-tracker'
import MockEventCollector from '../../../helpers/statistics/mock-event-collector'
import { createEventFactory } from '../../../../src/app/statistics/events'

describe('StartupEventTracker', () => {
  const mockCollector = new MockEventCollector()

  const applicationInfo = { name: 'mock name', version: 'mock version' }
  const eventFactory = createEventFactory(applicationInfo)
  const tracker = new StartupEventTracker(mockCollector, eventFactory)

  describe('.startup', () => {
    it('collects startup event', () => {
      tracker.startup()

      expect(mockCollector.events.length).to.eql(1)

      const event = mockCollector.events[0]
      expect(event.eventName).to.eql('startup')
      expect(event.application).to.eql(applicationInfo)
      expect(event.context.platform).to.be.a('string')
    })
  })
})
