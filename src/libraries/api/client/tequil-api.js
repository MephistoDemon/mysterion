// @flow

import type {HttpInterface} from './adapters/interface'
import ProposalDTO from './dto/proposal'
import ProposalsResponseDTO from './dto/proposals-response'
import ProposalsFilter from './dto/proposals-filter'

class TequilApi {
  http: HttpInterface

  constructor (http: HttpInterface) {
    this.http = http
  }

  async healthCheck (timeout: number) {
    return this.http.get('healthcheck', {timeout})
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    const query = filter ? filter.toQueryParams() : null
    const response = await this.http.get('proposals', query)
    const responseDto = new ProposalsResponseDTO(response)

    return responseDto.proposals
  }
}

export default TequilApi
