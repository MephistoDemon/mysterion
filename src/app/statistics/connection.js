// @flow
import {EventCollector, Event} from './collector'

type UserTime = {
  localTime: number,
  utcTime: number
}

type UserTimeProvider = () => UserTime
type EventFactory = (name: string, details: Object) => Event

type ConnectDetails = {
  consumerId: string,
  providerId: string
}

class ConnectEventTracker {
  _collector: EventCollector
  _userTimeProvider: UserTimeProvider
  _eventFactory: EventFactory
  _connectStarted: boolean = false
  _eventDetails: Object = {}
  constructor (collector: EventCollector, userTimeProvider: UserTimeProvider, eventFactory: EventFactory) {
    this._collector = collector
    this._userTimeProvider = userTimeProvider
    this._eventFactory = eventFactory
  }

  connectStarted (connectDetails: ConnectDetails): void {
    this._eventDetails = {
      startedAt: this._userTimeProvider(),
      connectDetails: connectDetails
    }
    this._connectStarted = true
  }

  async connectEnded (error?: any): Promise<any> {
    this._checkConnectStarted()
    this._insertEndTimesIntoEventDetails()
    if (error) {
      this._eventDetails['error'] = error
      return this._collector.collectEvents(this._eventFactory('connect_failed', this._eventDetails))
    }
    return this._collector.collectEvents(this._eventFactory('connect_successful', this._eventDetails))
  }

  async connectCanceled (): Promise<any> {
    this._checkConnectStarted()
    this._insertEndTimesIntoEventDetails()
    return this._collector.collectEvents(this._eventFactory('connect_canceled', this._eventDetails))
  }

  _checkConnectStarted (): void {
    if (!this._connectStarted) {
      throw new Error('connect start not marked')
    }
  }

  _insertEndTimesIntoEventDetails (): void {
    let endtime = this._userTimeProvider()
    this._eventDetails['endedAt'] = endtime
    this._eventDetails['timeDelta'] = endtime.utcTime - this._eventDetails['startedAt'].utcTime
  }
}

function currentUserTime () {
  let currentDate = new Date()
  let utcTimestamp = currentDate.getTime()
  let localOffsetInMillis = currentDate.getTimezoneOffset() * 60 * 1000
  return {
    utcTime: utcTimestamp,
    localTime: utcTimestamp + localOffsetInMillis
  }
}

export type {UserTime, UserTimeProvider, ConnectDetails}
export {currentUserTime, ConnectEventTracker}
