// @flow

import {HttpInterface} from './adapters/interface'
import ProposalDto from './dto/proposal'

class TequilApi {
  http: HttpInterface

  constructor (http: HttpInterface) {
    this.http = http
  }

  async healthCheck (timeout: number) {
    return this.http.get('healthcheck', {timeout})
  }

  async getProposals (options: ?Object): Array<ProposalDto> {
    let proposals: Array<ProposalDto> = []
    let response: { proposals: Array<ProposalDto> } = {proposals: []}

    try {
      response = await this.http.get('proposals', options)
      if (typeof response.proposals !== 'undefined') {
        proposals = response.proposals.map((proposal) => {
          proposal = new ProposalDto(proposal)

          return proposal
        })
      }
    } catch (e) {
      // $FlowFixMe
      return proposals
    }

    // $FlowFixMe
    return proposals
  }
}

export default TequilApi
