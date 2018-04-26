import {ConnectEventTracker} from '../../../../src/libraries/statistics/connection'
import {remote} from 'electron'

describe('Connection statistics', () => {
  let mockedCollector = {
    events: [],
    collectEvents: function (...eventArray) {
      this.events = eventArray
      return Promise.resolve()
    }
  }
  const connectionDetails = {
    consumer_id: 'consumer_id',
    provider_id: 'provider_id'
  }

  const appVersion = `${remote.getGlobal('__version')}(${remote.getGlobal('__buildNumber')})`

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
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectEnded('some error')
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        application_scope: 'mysterion_application',
        application_version: appVersion,
        event_name: 'connect_failed',
        context: {
          connection_details: {
            consumer_id: 'consumer_id',
            provider_id: 'provider_id'
          },
          started_at: {
            utcTime: 123,
            localTime: 321
          },
          ended_at: {
            utcTime: 246,
            localTime: 444
          },
          time_delta: 123,
          error: 'some error'
        }
      }
    )
  })
  it('sends connect successful event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectEnded()
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        application_scope: 'mysterion_application',
        application_version: appVersion,
        event_name: 'connect_successful',
        context: {
          connection_details: {
            consumer_id: 'consumer_id',
            provider_id: 'provider_id'
          },
          started_at: {
            utcTime: 123,
            localTime: 321
          },
          ended_at: {
            utcTime: 246,
            localTime: 444
          },
          time_delta: 123
        }
      }
    )
  })
  it('sends connect canceled event', async () => {
    const eventTracker = new ConnectEventTracker(mockedCollector, mockedTimeProvider)
    eventTracker.ConnectStarted(connectionDetails)
    await eventTracker.ConnectCanceled()
    expect(mockedCollector.events[0]).to.deep.eql(
      {
        application_scope: 'mysterion_application',
        application_version: appVersion,
        event_name: 'connect_canceled',
        context: {
          connection_details: {
            consumer_id: 'consumer_id',
            provider_id: 'provider_id'
          },
          started_at: {
            utcTime: 123,
            localTime: 321
          },
          ended_at: {
            utcTime: 246,
            localTime: 444
          },
          time_delta: 123
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
