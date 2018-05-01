import {expect} from 'chai'
import ServiceDefinitionDTO from '../../../../../../src/libraries/api/client/dto/service-definition'

describe('TequilApi client DTO', () => {
  describe('ServiceDefinitionDTO', () => {
    it('sets properties', async () => {
      const service = new ServiceDefinitionDTO({
        locationOriginate: {
          country: 'LT'
        }
      })

      expect(service.locationOriginate.country).to.equal('LT')
    })

    it('sets empty properties', async () => {
      const service = new ServiceDefinitionDTO({})

      expect(service.locationOriginate).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const service = new ServiceDefinitionDTO('I am wrong')

      expect(service.locationOriginate).to.be.undefined
    })
  })
})
