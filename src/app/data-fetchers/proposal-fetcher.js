// @flow

import ProposalDto from '../../libraries/api/client/dto/proposal'
import TequilApi from '../../libraries/api/client/tequil-api'
import {FunctionLooper} from '../../libraries/functionLooper'

class ProposalFetcher {
  api: TequilApi
  proposals: Array<ProposalDto> = []
  loop: FunctionLooper
  subscribers: Array<Function> = []

  constructor (api: TequilApi) {
    this.api = api
  }

  run (interval: number = 5000): this {
    this.loop = new FunctionLooper(async () => {
      this._notifySubscribers(await this.fetch())
    }, interval)

    this.loop.start()

    return this
  }

  async fetch (): Promise<Array<ProposalDto>> {
    return await this.api.findProposals()
  }

  stop () {
    this.loop.stop()
  }

  subscribe (callback: Function): this {
    this.subscribers.push(callback)

    return this
  }

  _notifySubscribers (proposals: Array<ProposalDto>) {
    this.subscribers.forEach((callback) => {
      callback(proposals)
    })
  }
}

export default ProposalFetcher
