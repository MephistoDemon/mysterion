import {expect} from 'chai'
import ProposalDto from '@/../libraries/api/client/dto/proposal'

describe('TequilApi', () => {
  describe('ProposalDto', () => {
    const proposal = {
      id: 1,
      providerId: '0x1',
      serviceType: 'openvpn',
      serviceDefinition: {
        locationOriginate: {
          asn: '',
          country: 'LT'
        }
      }
    }

    it('constructor sets properties', async () => {
      const proposalObj = new ProposalDto(proposal)
      expect(proposalObj.id).to.equal(1)
      expect(proposalObj.providerId).to.equal('0x1')
      expect(proposalObj.serviceType).to.equal('openvpn')
      expect(proposalObj.serviceDefinition.locationOriginate.country).to.equal('LT')
    })
  })
})
