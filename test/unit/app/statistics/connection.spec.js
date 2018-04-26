import {ConnectEventTracker} from '../../../../src/app/statistics/connection'

describe('Connection statistics', () => {
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
      {utcTime: 123, localTime: 321},
      {utcTime: 246, localTime: 444}
    ]
    let i = 0
    mockedTimeProvider = () => {
      return timestamps[i++]
    }
  })

  it('sends connect failed event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectEnded('some error')
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
          error: 'some error'
        }
      }
    )
  })
  it('sends connect successful event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectEnded()
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
          timeDelta: 123
        }
      }
    )
  })
  it('sends connect canceled event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider, mockedEventFactory)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectCanceled()
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
          timeDelta: 123
        }
      }
    )
  })
  it('returns rejected promise if connect ended is called before connect started', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider)
    try {
      await eventTracker.ConnectEnded('some error')
    } catch (e) {
      expect(e).to.be.instanceOf(Error).and.have.property('message', 'connect start not marked')
    }
  })
})
