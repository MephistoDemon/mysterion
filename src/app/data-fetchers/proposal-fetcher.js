// @flow

import ProposalDTO from '../../libraries/mysterium-tequilapi/dto/proposal'
import TequilapiClient from '../../libraries/mysterium-tequilapi/client'
import {FunctionLooper} from '../../libraries/functionLooper'

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
      this._notifySubscribers(await this.fetch())
    }, this._interval)

    this._loop.start()

    return this
  }

  fetch (): Promise<Array<ProposalDTO>> {
    return this._api.findProposals()
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
