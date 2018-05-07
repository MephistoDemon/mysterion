import {expect} from 'chai'
import NodeVersionDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-version'

describe('TequilApi client DTO', () => {
  describe('NodeVersionDTO', () => {
    it('sets properties', async () => {
      const version = new NodeVersionDTO({
        commit: '0bcccc',
        branch: 'master',
        buildNumber: '001'
      })

      expect(version.commit).to.equal('0bcccc')
      expect(version.branch).to.equal('master')
      expect(version.buildNumber).to.equal('001')
    })

    it('sets empty properties', async () => {
      const version = new NodeVersionDTO({})

      expect(version.commit).to.be.undefined
      expect(version.branch).to.be.undefined
      expect(version.buildNumber).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const version = new NodeVersionDTO('I am wrong')

      expect(version.commit).to.be.undefined
      expect(version.branch).to.be.undefined
      expect(version.buildNumber).to.be.undefined
    })
  })
})
