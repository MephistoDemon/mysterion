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
import { EventCollector } from './events'
import type { EventFactory } from './events'

type UserTime = {
  localTime: number,
  utcTime: number
}

type UserTimeProvider = () => UserTime

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

  connectStarted (connectDetails: ConnectDetails, originalCountry: string): void {
    this._eventDetails = {
      startedAt: this._userTimeProvider(),
      connectDetails,
      originalCountry
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

export type { UserTime, UserTimeProvider, ConnectDetails }
export { currentUserTime, ConnectEventTracker }
