// @flow

import {HttpInterface} from './interface'

class FakeAdapter implements HttpInterface {
  proposals: mixed
  healthcheck: mixed

  setProposalsResponse (proposals: mixed) {
    this.proposals = proposals
  }

  setHealthcheckResponse (healthcheck: mixed) {
    this.healthcheck = healthcheck
  }

  async get (path: string, options: ?Object): any {
    if (path === 'proposals') {
      return this.proposals
    }

    if (path === 'healthcheck') {
      return this.healthcheck
    }

    return {}
  }

  async post (path: string, data: mixed, options: ?Object): any {
  }

  async delete (path: string, options: ?Object): any {
  }

  async put (path: string, data: mixed, options: ?Object): any {
  }
}

export default FakeAdapter
