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
import MockEventCollector from '../../../helpers/statistics/mock-event-collector'
import EventSenderToCollector from '../../../../src/app/statistics/event-sender-to-collector'
import type { EventFactory } from '../../../../src/app/statistics/events'

const mockedEventFactory: EventFactory = (name: string, details: Object) => {
  return {
    application: {
      name: 'mocked application',
      version: 'mocked version'
    },
    eventName: name,
    createdAt: 123,
    context: details
  }
}

describe('EventSenderToCollector', () => {
  const mockCollector = new MockEventCollector()
  const eventSender = new EventSenderToCollector(mockCollector, mockedEventFactory)

  describe('.send', () => {
    it('creates and sends event', async () => {
      await eventSender.send('test event', { key: 'value' })

      expect(mockCollector.events.length).to.eql(1)
      expect(mockCollector.events[0]).to.eql({
        eventName: 'test event',
        application: {
          name: 'mocked application',
          version: 'mocked version'
        },
        createdAt: 123,
        context: {
          key: 'value'
        }
      })
    })
  })
})
