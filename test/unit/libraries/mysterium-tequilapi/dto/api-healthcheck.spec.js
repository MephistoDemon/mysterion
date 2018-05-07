import {expect} from 'chai'
import NodeHealthcheckDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'
import NodeVersionDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-version'

describe('Tequilapi DTO', () => {
  describe('NodeHealthcheckDTO', () => {
    it('sets properties', async () => {
      const status = new NodeHealthcheckDTO({
        uptime: '1h10m',
        process: 1111,
        version: {}
      })

      expect(status.uptime).to.equal('1h10m')
      expect(status.process).to.equal(1111)
      expect(status.version).to.deep.equal(new NodeVersionDTO({}))
    })

    it('sets empty properties', async () => {
      const status = new NodeHealthcheckDTO({})

      expect(status.uptime).to.be.undefined
      expect(status.process).to.be.undefined
      expect(status.version).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const status = new NodeHealthcheckDTO('I am wrong')

      expect(status.uptime).to.be.undefined
      expect(status.process).to.be.undefined
      expect(status.version).to.be.undefined
    })
  })
})
