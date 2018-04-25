// @flow

import {HttpInterface} from './interface'

class FakeAdapter implements HttpInterface {
  proposals: Array<Object>
  healthcheck: Object
  error: Error

  setError (error: Error) {
    this.error = error
  }

  setProposalsResponse (proposals: Array<Object>) {
    this.proposals = proposals
  }

  setHealthcheckResponse (healthcheck: Object) {
    this.healthcheck = healthcheck
  }

  async get (path: string, options: ?Object): Promise<?mixed> {
    if (this.error) {
      throw this.error
    }

    if (path === 'proposals') {
      return Promise.resolve(this.proposals)
    }

    if (path === 'healthcheck') {
      return Promise.resolve(this.healthcheck)
    }

    throw new Error('Unknown path given: ' + path)
  }

  async post (path: string, data: mixed, options: ?Object): Promise<?Object> {
  }

  async delete (path: string, options: ?Object): Promise<?Object> {
  }

  async put (path: string, data: mixed, options: ?Object): Promise<?Object> {
  }
}

export default FakeAdapter
