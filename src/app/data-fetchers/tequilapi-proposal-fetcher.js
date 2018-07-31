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
import type { Callback } from '../../libraries/subscriber'
import Subscriber from '../../libraries/subscriber'
import type { ProposalFetcher } from './proposal-fetcher'

class TequilapiProposalFetcher implements ProposalFetcher {
  _api: TequilapiClient
  _loop: FunctionLooper
  _proposalSubscriber: Subscriber<ProposalDTO[]> = new Subscriber()
  _errorSubscriber: Subscriber<Error> = new Subscriber()

  constructor (api: TequilapiClient, interval: number = 5000) {
    this._api = api

    this._loop = new FunctionLooper(async () => {
      await this.fetch()
    }, interval)
    this._loop.onFunctionError((error) => {
      this._errorSubscriber.notify(error)
    })
  }

  /**
   * Starts periodic proposal fetching.
   */
  start (): void {
    this._loop.start()
  }

  /**
   * Forces proposals to be fetched without delaying.
   */
  async fetch (): Promise<ProposalDTO[]> {
    const proposals = await this._api.findProposals()

    this._proposalSubscriber.notify(proposals)

    return proposals
  }

  async stop (): Promise<void> {
    await this._loop.stop()
  }

  onFetchedProposals (subscriber: Callback<ProposalDTO[]>): void {
    this._proposalSubscriber.subscribe(subscriber)
  }

  onFetchingError (subscriber: Callback<Error>): void {
    this._errorSubscriber.subscribe(subscriber)
  }
}

export default TequilapiProposalFetcher
