// @flow
import {EventCollector, newEvent} from './collector'

type UserTime = {
  localTime: number,
  utcTime: number
}

type UserTimeProvider = () => UserTime

type ConnectDetails = {
  consumer_id: string,
  provider_id: string
}

class ConnectEventTracker {
  _collector: EventCollector
  _userTimeProvider: UserTimeProvider
  _connectStarted: boolean
  _eventDetails: any
  constructor (collector: EventCollector, userTimeProvider: UserTimeProvider) {
    this._collector = collector
    this._userTimeProvider = userTimeProvider
    this._connectStarted = false
    this._eventDetails = {}
  }

  ConnectStarted (connectDetails: ConnectDetails): void {
    this._eventDetails = {
      started_at: this._userTimeProvider(),
      connection_details: connectDetails
    }
    this._connectStarted = true
  }

  async ConnectEnded (error?: any): Promise<any> {
    this._checkConnectStarted()
    this._insertEndTimesIntoEventDetails()
    if (error) {
      this._eventDetails['error'] = error
      return this._collector.collectEvents(newEvent('connect_failed', this._eventDetails))
    }
    return this._collector.collectEvents(newEvent('connect_successful', this._eventDetails))
  }

  async ConnectCanceled (): Promise<any> {
    this._checkConnectStarted()
    this._insertEndTimesIntoEventDetails()
    this._collector.collectEvents(newEvent('connect_canceled', this._eventDetails))
  }

  _checkConnectStarted (): void {
    if (!this._connectStarted) {
      throw new Error('connect start not marked')
    }
  }

  _insertEndTimesIntoEventDetails (): void {
    let endtime = this._userTimeProvider()
    let delta = endtime.utcTime - this._eventDetails['started_at'].utcTime
    this._eventDetails['time_delta'] = delta
    this._eventDetails['ended_at'] = endtime
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
