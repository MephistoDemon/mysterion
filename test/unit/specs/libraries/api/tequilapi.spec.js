/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {tequilapiFactory} from '@/../libraries/api/tequilapi'

const axioInstance = axios.create()
const tequilApi = tequilapiFactory(axioInstance)
const mock = new MockAdapter(axioInstance)

describe('tequilAPI', () => {
  it('creates some new identity', async () => {
    mock.onPost('/identities').replyOnce(200, {id: '0xMOKFACE'})
    try {
      const newID = await tequilApi.identity.create('')
      expect(newID).to.be.eql({id: '0xMOKFACE'})
    } catch (err) {
      expect(err).to.be.undefined
    }
  })

  describe('ip', () => {
    it('returns ip when endpoint succeeds', async () => {
      mock.onGet('/connection/ip').replyOnce(200, {ip: 'mock ip'})
      const ip = await tequilApi.connection.ip()
      expect(ip).to.deep.eql('mock ip')
    })
  })
})

describe('tequilAPI error handling', () => {
  it('throws network error', async () => {
    mock.onGet('/healthcheck').networkError()
    try {
      const a = await tequilApi.healthCheck()
      expect(a).to.be.undefined
    } catch (err) {
      expect(err.message).to.eql('Network Error')
    }
  })

  it('throws timeout', async () => {
    mock.reset()
    mock.onGet('/healthcheck').timeout()
    try {
      const a = await tequilApi.healthCheck()
      expect(a).to.be.undefined
    } catch (err) {
      expect(err.message).to.match(/timeout of .*ms exceeded/)
    }
  })

  it('throws 404', async () => {
    mock.reset()
    mock.onGet('/healthcheck').reply(404, {message: 'What is wrong'})
    try {
      const health = await tequilApi.healthCheck()
      expect(health).to.not.exist
    } catch (err) {
      expect(err.message).to.eql('Request failed with status code 404')
      expect(err.response.data.message).to.eql('What is wrong')
    }
  })
})
