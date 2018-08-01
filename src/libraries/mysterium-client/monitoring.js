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
import TequilapiClient from '../mysterium-tequilapi/client'

const healthCheckInterval = 1500
const healthCheckTimeout = 500

type StatusCallback = (boolean) => void
type UpCallback = () => void
type DownCallback = () => void

class Monitoring {
  api: TequilapiClient
  _timer: TimeoutID

  _lastIsRunning: boolean = false
  _subscribersStatus: Array<StatusCallback> = []
  _subscribersUp: Array<UpCallback> = []
  _subscribersDown: Array<DownCallback> = []
  _isStarted: boolean = false

  constructor (tequilapi: TequilapiClient) {
    this.api = tequilapi
  }

  start () {
    if (this._isStarted) {
      return
    }
    this._isStarted = true
    this._healthCheckLoop()
  }

  stop () {
    this._isStarted = false
    if (this._timer) {
      clearTimeout(this._timer)
    }
  }

  onStatus (callback: StatusCallback) {
    this._subscribersStatus.push(callback)
    callback(this._lastIsRunning)
  }

  removeOnStatus (callback: StatusCallback) {
    const i = this._subscribersStatus.indexOf(callback)
    if (i >= 0) {
      this._subscribersStatus.splice(i, 1)
    }
  }

  onStatusUp (callback: UpCallback) {
    this._subscribersUp.push(callback)
  }

  onStatusDown (callback: DownCallback) {
    this._subscribersDown.push(callback)
  }

  async _healthCheckLoop (): Promise<void> {
    let isRunning
    try {
      await this.api.healthCheck(healthCheckTimeout)
      isRunning = true
    } catch (e) {
      isRunning = false
    }

    try {
      this._notifySubscribers(isRunning)
    } catch (e) {
      e.message = 'Bad subscriber added to Monitoring: ' + e.message
      throw e
    } finally {
      this._timer = setTimeout(() => this._healthCheckLoop(), healthCheckInterval)
    }
  }

  _notifySubscribers (isRunning: boolean) {
    this._notifySubscribersStatus(isRunning)

    if (this._lastIsRunning === isRunning) {
      return
    }
    if (isRunning) {
      this._notifySubscribersUp()
    } else {
      this._notifySubscribersDown()
    }
    this._lastIsRunning = isRunning
  }

  _notifySubscribersStatus (isRunning: boolean) {
    this._subscribersStatus.forEach((callback: StatusCallback) => {
      callback(isRunning)
    })
  }

  _notifySubscribersUp () {
    this._subscribersUp.forEach((callback: UpCallback) => {
      callback()
    })
  }

  _notifySubscribersDown () {
    this._subscribersDown.forEach((callback: DownCallback) => {
      callback()
    })
  }
}

export default Monitoring
export type {StatusCallback, UpCallback, DownCallback}
