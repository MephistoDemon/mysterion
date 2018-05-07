import {expect} from 'chai'
import ServiceDefinitionDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/service-definition'
import LocationDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/location'

describe('TequilapiClient DTO', () => {
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
