import {expect} from 'chai'
import ProposalsResponseDto from '../../../../../../src/libraries/api/client/dto/proposals-response'

describe('TequilApi client DTO', () => {
  describe('ProposalResponseDto', () => {
    it('sets properties', async () => {
      const response = new ProposalsResponseDto({
        proposals: [{id: 100}]
      })

      expect(response.proposals).to.have.lengthOf(1)
      expect(response.proposals[0].id).to.equal(100)
    })

    it('sets empty properties', async () => {
      const response = new ProposalsResponseDto({})

      expect(response.proposals).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const response = new ProposalsResponseDto('I am wrong')

      expect(response.proposals).to.be.undefined
    })
  })
})
