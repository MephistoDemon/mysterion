import {expect} from 'chai'
import ServiceDefinitionDTO from '../../../../../../src/libraries/api/client/dto/service-definition'
import LocationDTO from '../../../../../../src/libraries/api/client/dto/location'

describe('TequilApi client DTO', () => {
  describe('ServiceDefinitionDTO', () => {
    it('sets properties with full structure', async () => {
      const service = new ServiceDefinitionDTO({
        locationOriginate: {}
      })

      expect(service.locationOriginate).to.deep.equal(new LocationDTO({}))
    })

    it('sets empty properties structure', async () => {
      const service = new ServiceDefinitionDTO({})

      expect(service.locationOriginate).to.be.undefined
    })

    it('sets wrong properties structure', async () => {
      const service = new ServiceDefinitionDTO('I am wrong')

      expect(service.locationOriginate).to.be.undefined
    })
  })
})
