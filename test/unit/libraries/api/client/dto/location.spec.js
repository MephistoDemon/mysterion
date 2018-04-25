import {expect} from 'chai'
import LocationDto from '../../../../../../src/libraries/api/client/dto/location'

describe('TequilApi client DTO', () => {
  describe('LocationDto', () => {
    it('sets properties', async () => {
      const location = new LocationDto({
        asn: '',
        country: 'LT'
      })

      expect(location.country).to.equal('LT')
    })

    it('sets empty properties', async () => {
      const location = new LocationDto({})

      expect(location.country).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const location = new LocationDto('I am wrong')

      expect(location.country).to.be.undefined
    })
  })
})
