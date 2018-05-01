// @flow
import ProposalDTO from './proposal'

type ResponseMap = {
  proposals: Array<Object>
}

class ProposalsResponseDTO {
  proposals: Array<ProposalDTO>

  constructor (responseData: ResponseMap) {
    if (typeof responseData.proposals !== 'undefined') {
      this.proposals = responseData.proposals.map((proposal) => new ProposalDTO(proposal))
    }
  }
}

export default ProposalsResponseDTO
