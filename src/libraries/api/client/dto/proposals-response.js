// @flow
import ProposalDto from './proposal'

type ResponseMap = {
  proposals: Array<Object>
}

class ProposalsResponseDto {
  proposals: Array<ProposalDto>

  constructor (responseData: ResponseMap) {
    if (typeof responseData.proposals !== 'undefined') {
      this.proposals = responseData.proposals.map((proposal) => new ProposalDto(proposal))
    }
  }
}

export default ProposalsResponseDto
