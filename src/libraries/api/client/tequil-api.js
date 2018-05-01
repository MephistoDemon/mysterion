// @flow

import {HttpInterface} from './adapters/interface'
import ProposalDTO from './dto/proposal'
import ProposalsResponseDTO from './dto/proposals-response'

class TequilApi {
  http: HttpInterface

  constructor (http: HttpInterface) {
    this.http = http
  }

  async healthCheck (timeout: number) {
    return this.http.get('healthcheck', {timeout})
  }

  async findProposals (filter: ProposalsFilter): Promise<Array<ProposalDTO>> {
    const options = {}
    if (filter) {
      options['params'] = filterToURLParams(filter)
    }

    const response = await this.http.get('proposals', options)
    const responseDto = new ProposalsResponseDTO(response)

    return responseDto.proposals
  }
}

class ProposalsFilter {
  providerId: string
}

function filterToURLParams (filter: ProposalsFilter): Object {
  throw new Error('Proposal filtering not implemented yet')
}

export default TequilApi
