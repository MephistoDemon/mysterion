import {expect} from 'chai'
import ProposalDto from '../../../../../../src/libraries/api/client/dto/proposal'

describe('TequilApi client DTO', () => {
  describe('ProposalDto', () => {
    it('sets properties', async () => {
      const proposal = new ProposalDto({
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

    it('sets empty properties', async () => {
      const proposal = new ProposalDto({})

      expect(proposal.id).to.be.undefined
      expect(proposal.providerId).to.be.undefined
      expect(proposal.serviceType).to.be.undefined
      expect(proposal.serviceDefinition).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const proposal = new ProposalDto('I am wrong')

      expect(proposal.id).to.be.undefined
      expect(proposal.providerId).to.be.undefined
      expect(proposal.serviceType).to.be.undefined
      expect(proposal.serviceDefinition).to.be.undefined
    })
  })
})
