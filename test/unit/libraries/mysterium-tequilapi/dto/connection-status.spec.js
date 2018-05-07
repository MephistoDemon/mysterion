import {expect} from 'chai'
import ConnectionStatusDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-status'
import ConnectionStatusEnum from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-status-enum'

describe('TequilapiClient DTO', () => {
  describe('ConnectionStatusDTO', () => {
    it('sets properties', async () => {
      const connection = new ConnectionStatusDTO({
        status: 'Connected',
        sessionId: 'My-super-session'
      })

      expect(connection.status).to.equal(ConnectionStatusEnum.CONNECTED)
      expect(connection.sessionId).to.equal('My-super-session')
    })

    it('sets empty properties', async () => {
      const connection = new ConnectionStatusDTO({})

      expect(connection.status).to.be.undefined
      expect(connection.sessionId).to.be.undefined
    })

    it('sets wrong properties', async () => {
      const connection = new ConnectionStatusDTO('I am wrong')

      expect(connection.status).to.be.undefined
      expect(connection.sessionId).to.be.undefined
    })
  })
})
