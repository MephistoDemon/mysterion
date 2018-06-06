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

import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import type { TequilapiClient } from '../../libraries/mysterium-tequilapi/client'
import { FunctionLooper } from '../../libraries/functionLooper'

class ProposalFetcher {
  _api: TequilapiClient
  _loop: FunctionLooper
  _subscribers: Array<Function> = []
  _interval: number

  constructor (api: TequilapiClient, interval: number = 5000) {
    this._api = api
    this._interval = interval
  }

  start (): this {
    this._loop = new FunctionLooper(async () => {
      await this.fetch()
    }, this._interval)

    this._loop.start()

    return this
  }

  async fetch (): Promise<Array<ProposalDTO>> {
    const proposals = await this._api.findProposals()

    this._notifySubscribers(proposals)

    return proposals
  }

  stop () {
    this._loop.stop()
  }

  subscribe (callback: Function): this {
    this._subscribers.push(callback)

    return this
  }

  _notifySubscribers (proposals: Array<ProposalDTO>) {
    this._subscribers.forEach((callback) => {
      callback(proposals)
    })
  }
}

export default ProposalFetcher
