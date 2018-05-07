import {expect} from 'chai'
import ConnectionStatisticsDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-statistics'

describe('Tequilapi DTO', () => {
  describe('ConnectionStatisticsDTO', () => {
    it('sets properties', async () => {
      const stats = new ConnectionStatisticsDTO({
        duration: 13325,
        bytesReceived: 1232133, // 1.17505 MB
        bytesSent: 123321 // 0.117608 MB
      })

      expect(stats.duration).to.equal(13325)
      expect(stats.bytesReceived).to.equal(1232133)
      expect(stats.bytesSent).to.deep.equal(123321)
    })

    it('sets empty properties', async () => {
      const stats = new ConnectionStatisticsDTO({})

      expect(stats.duration).to.be.undefined
      expect(stats.bytesReceived).to.be.undefined
      expect(stats.bytesSent).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const stats = new ConnectionStatisticsDTO('I am wrong')

      expect(stats.duration).to.be.undefined
      expect(stats.bytesReceived).to.be.undefined
      expect(stats.bytesSent).to.be.undefined
    })
  })
})
