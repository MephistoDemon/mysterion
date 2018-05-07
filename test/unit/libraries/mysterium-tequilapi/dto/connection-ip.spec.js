import {expect} from 'chai'
import ConnectionIPDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-ip'

describe('TequilapiClient DTO', () => {
  describe('ConnectionIPDTO', () => {
    it('sets properties', async () => {
      const model = new ConnectionIPDTO({ip: 'mock ip'})

      expect(model.ip).to.equal('mock ip')
    })

    it('sets empty properties', async () => {
      const model = new ConnectionIPDTO({})

      expect(model.ip).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const model = new ConnectionIPDTO('I am wrong')

      expect(model.ip).to.be.undefined
    })
  })
})
