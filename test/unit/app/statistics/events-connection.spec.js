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

import { ConnectEventTracker } from '../../../../src/app/statistics/events-connection'
import { capturePromiseError } from '../../../helpers/utils'
import { beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import MockEventSender from '../../../helpers/statistics/mock-event-sender'

describe('ConnectEventTracker', () => {
  let eventTracker: ConnectEventTracker

  const connectionDetails = {
    consumerId: 'consumerId',
    providerId: 'providerId'
  }

  let eventSender
  let mockedTimeProvider

  beforeEach(() => {
    const timestamps = [
      { utcTime: 123, localTime: 321 },
      { utcTime: 246, localTime: 444 }
    ]
    let i = 0
    eventSender = new MockEventSender()
    mockedTimeProvider = () => {
      return timestamps[i++]
    }
    eventTracker = new ConnectEventTracker(eventSender, mockedTimeProvider)
  })

  it('sends connect failed event', async () => {
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectEnded('some error')
    expect(eventSender.events[0]).to.deep.eql(
      {
        eventName: 'connect_failed',
        context: {
          connectDetails: {
            consumerId: 'consumerId',
            providerId: 'providerId'
          },
          startedAt: {
            utcTime: 123,
            localTime: 321
          },
          endedAt: {
            utcTime: 246,
            localTime: 444
          },
          timeDelta: 123,
          error: 'some error',
          originalCountry: 'original country'
        }
      }
    )
  })

  it('sends connect successful event', async () => {
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectEnded()
    expect(eventSender.events[0]).to.deep.eql(
      {
        eventName: 'connect_successful',
        context: {
          connectDetails: {
            consumerId: 'consumerId',
            providerId: 'providerId'
          },
          startedAt: {
            utcTime: 123,
            localTime: 321
          },
          endedAt: {
            utcTime: 246,
            localTime: 444
          },
          timeDelta: 123,
          originalCountry: 'original country'
        }
      }
    )
  })

  it('sends connect canceled event', async () => {
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectCanceled()
    expect(eventSender.events[0]).to.deep.eql(
      {
        eventName: 'connect_canceled',
        context: {
          connectDetails: {
            consumerId: 'consumerId',
            providerId: 'providerId'
          },
          startedAt: {
            utcTime: 123,
            localTime: 321
          },
          endedAt: {
            utcTime: 246,
            localTime: 444
          },
          timeDelta: 123,
          originalCountry: 'original country'
        }
      }
    )
  })

  it('returns rejected promise if connect ended is called before connect started', async () => {
    const e = await capturePromiseError(eventTracker.connectEnded('some error'))
    expect(e).to.be.instanceOf(Error).and.have.property('message', 'connect start not marked')
  })
})
