import {expect} from 'chai'
import ConnectionRequestDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-request'

describe('TequilApi client DTO', () => {
  describe('ConnectionRequestDTO', () => {
    it('sets properties', async () => {
      const request = new ConnectionRequestDTO('0x1000FACE', '0x2000FACE')

      expect(request.consumerId).to.equal('0x1000FACE')
      expect(request.providerId).to.equal('0x2000FACE')
    })

    it('sets wrong properties', async () => {
      const request = new ConnectionRequestDTO()

      expect(request.consumerId).to.be.undefined
      expect(request.providerId).to.be.undefined
    })
  })
})
