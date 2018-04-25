import {expect} from 'chai'
import ServiceDefinitionDto from '../../../../../../src/libraries/api/client/dto/service-definition'

describe('TequilApi client DTO', () => {
  describe('ServiceDefinitionDto', () => {
    it('sets properties', async () => {
      const service = new ServiceDefinitionDto({
        locationOriginate: {
          country: 'LT'
        }
      })

      expect(service.locationOriginate.country).to.equal('LT')
    })

    it('sets empty properties', async () => {
      const service = new ServiceDefinitionDto({})

      expect(service.locationOriginate).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const service = new ServiceDefinitionDto('I am wrong')

      expect(service.locationOriginate).to.be.undefined
    })
  })
})
