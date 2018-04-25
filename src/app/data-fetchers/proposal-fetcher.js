// @flow

import ProposalDto from '../../libraries/api/client/dto/proposal'
import TequilApi from '../../libraries/api/client/tequil-api'
import {FunctionLooper} from '../../libraries/functionLooper'

class ProposalFetcher {
  _api: TequilApi
  _proposals: Array<ProposalDto> = []
  _loop: FunctionLooper
  _subscribers: Array<Function> = []
  _interval: number

  constructor (api: TequilApi, interval: number = 5000) {
    this._api = api
    this._interval = interval
  }

  start (): this {
    this._loop = new FunctionLooper(async () => {
      this._notifySubscribers(await this.fetch())
    }, this._interval)

    this._loop.start()

    return this
  }

  async fetch (): Promise<Array<ProposalDto>> {
    const proposals = await this._api.findProposals()

    return proposals
  }

  stop () {
    this._loop.stop()
  }

  subscribe (callback: Function): this {
    this._subscribers.push(callback)

    return this
  }

  _notifySubscribers (proposals: Array<ProposalDto>) {
    this._subscribers.forEach((callback) => {
      callback(proposals)
    })
  }
}

export default ProposalFetcher
