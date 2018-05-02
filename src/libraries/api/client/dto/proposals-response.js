// @flow
import ProposalDTO from './proposal'

type ResponseMapped = {
  proposals: Array<Object>
}

class ProposalsResponseDTO {
  proposals: Array<ProposalDTO>

  constructor (responseData: ResponseMapped) {
    if (typeof responseData.proposals !== 'undefined') {
      this.proposals = responseData.proposals.map((proposal) => new ProposalDTO(proposal))
    }
  }
}

export default ProposalsResponseDTO
