import {expect} from 'chai'
import IdentityDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/identity'

describe('Tequilapi DTO', () => {
  describe('IdentityDTO', () => {
    it('sets properties', async () => {
      const identity = new IdentityDTO({
        id: '0xF000FACE'
      })

      expect(identity.id).to.equal('0xF000FACE')
    })

    it('sets empty properties', async () => {
      const identity = new IdentityDTO({})

      expect(identity.id).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const identity = new IdentityDTO('I am wrong')

      expect(identity.id).to.be.undefined
    })
  })
})
