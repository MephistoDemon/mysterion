import {expect} from 'chai'
import IdentitiesResponseDTO from '../../../../../../src/libraries/api/client/dto/identities-response'
import IdentityDTO from '../../../../../../src/libraries/api/client/dto/identity'

describe('TequilApi client DTO', () => {
  describe('IdentitiesResponseDTO', () => {
    it('sets properties', async () => {
      const response = new IdentitiesResponseDTO([
        {id: '0x1000FACE'},
        {id: '0x2000FACE'}
      ])

      expect(response.identities).to.have.lengthOf(2)

      expect(response.identities[0]).to.be.an.instanceOf(IdentityDTO)
      expect(response.identities[0].id).to.equal('0x1000FACE')

      expect(response.identities[1]).to.be.an.instanceOf(IdentityDTO)
      expect(response.identities[1].id).to.equal('0x2000FACE')
    })

    it('sets empty properties', async () => {
      const response = new IdentitiesResponseDTO({})

      expect(response.identities).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const response = new IdentitiesResponseDTO('I am wrong')

      expect(response.identities).to.be.undefined
    })
  })
})
