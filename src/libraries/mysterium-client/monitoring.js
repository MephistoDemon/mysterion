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

const healthCheckInterval = 1500
const healthCheckTimeout = 500

class ProcessMonitoring {
  /**
   * @param {TequilapiClient} tequilapi
   */
  constructor (tequilapi) {
    this.api = tequilapi
    this.clientIsRunning = false
    this.apiTimeout = null
    this.ipcTimeout = null
  }

  start () {
    this._healthCheck()
  }

  stop () {
    if (this.apiTimeout) {
      clearTimeout(this.apiTimeout)
    }
    if (this.ipcTimeout) {
      clearTimeout(this.ipcTimeout)
    }
  }

  isRunning () {
    return this.clientIsRunning
  }

  onProcessReady (callback) {
    const interval = setInterval(() => {
      if (this.clientIsRunning) {
        clearInterval(interval)
        callback()
      }
    }, 100)
  }

  async _healthCheck () {
    try {
      await this.api.healthCheck(healthCheckTimeout)
      this.clientIsRunning = true
    } catch (e) {
      this.clientIsRunning = false
    }

    this.apiTimeout = setTimeout(() => {
      this._healthCheck()
    }, healthCheckInterval)
  }
}

export default ProcessMonitoring
