import {expect} from 'chai'
import ProposalDTO from '../../../../../../src/libraries/api/client/dto/proposal'

describe('TequilApi client DTO', () => {
  describe('ProposalDTO', () => {
    it('sets properties with full structure', async () => {
      const proposal = new ProposalDTO({
        id: 1,
        providerId: '0x1',
        serviceType: 'openvpn',
        serviceDefinition: {
          locationOriginate: {
            asn: '',
            country: 'LT'
          }
        }
      })

      expect(proposal.id).to.equal(1)
      expect(proposal.providerId).to.equal('0x1')
      expect(proposal.serviceType).to.equal('openvpn')
      expect(proposal.serviceDefinition.locationOriginate.country).to.equal('LT')
    })

    it('sets empty properties structure', async () => {
      const proposal = new ProposalDTO({})

      expect(proposal.id).to.be.undefined
      expect(proposal.providerId).to.be.undefined
      expect(proposal.serviceType).to.be.undefined
      expect(proposal.serviceDefinition).to.be.undefined
    })

    it('sets wrong properties structure', async () => {
      const proposal = new ProposalDTO('I am wrong')

      expect(proposal.id).to.be.undefined
      expect(proposal.providerId).to.be.undefined
      expect(proposal.serviceType).to.be.undefined
      expect(proposal.serviceDefinition).to.be.undefined
    })
  })
})
