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

  async findProposals (filter: ProposalsFilter): Array<ProposalDto> {
    let proposals: Array<ProposalDto> = []
    let response: { proposals: Array<ProposalDto> } = {proposals: []}

    const options = {}
    if (filter) {
      options['params'] = filterToURLParams(filter)
    }

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

class ProposalsFilter {
  providerId: string
}

function filterToURLParams (filter: ProposalsFilter): Object {
  throw new Error('Proposal filtering not implemented yet')
}

export default TequilApi
