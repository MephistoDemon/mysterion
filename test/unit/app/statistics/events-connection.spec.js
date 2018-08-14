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

import { ConnectEventTracker } from '../../../../src/app/statistics/events-connection'
import { capturePromiseError } from '../../../helpers/utils'
import { describe, it } from '../../../helpers/dependencies'

describe('ConnectEventTracker', () => {
  let mockedCollector = {
    events: [],
    collectEvents: function (...eventArray) {
      this.events = eventArray
      return Promise.resolve()
    }
  }
  const connectionDetails = {
    consumerId: 'consumerId',
    providerId: 'providerId'
  }

  let mockedEventFactory = (eventName, details) => {
    return {
      name: eventName,
      scope: 'mocked_event',
      context: details
    }
  }

  let mockedTimeProvider

  beforeEach(() => {
    let timestamps = [
      { utcTime: 123, localTime: 321 },
      { utcTime: 246, localTime: 444 }
    ]
    let i = 0
    mockedTimeProvider = () => {
      return timestamps[i++]
    }
  })

  it('sends connect failed event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectEnded('some error')
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        scope: 'mocked_event',
        name: 'connect_failed',
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
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectEnded()
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        scope: 'mocked_event',
        name: 'connect_successful',
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
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.connectStarted(connectionDetails, 'original country')
    await eventTracker.connectCanceled()
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        scope: 'mocked_event',
        name: 'connect_canceled',
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
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider)

    const e = await capturePromiseError(eventTracker.connectEnded('some error'))
    expect(e).to.be.instanceOf(Error).and.have.property('message', 'connect start not marked')
  })
})
