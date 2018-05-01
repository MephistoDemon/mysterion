import {expect} from 'chai'
import LocationDTO from '../../../../../../src/libraries/api/client/dto/location'

describe('TequilApi client DTO', () => {
  describe('LocationDTO', () => {
    it('sets properties', async () => {
      const location = new LocationDTO({
        asn: '',
        country: 'LT'
      })

      expect(location.country).to.equal('LT')
    })

    it('sets empty properties', async () => {
      const location = new LocationDTO({})

      expect(location.country).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const location = new LocationDTO('I am wrong')

      expect(location.country).to.be.undefined
    })
  })
})
