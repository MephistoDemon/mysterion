/* eslint no-unused-expressions: 0 */
import {expect} from 'chai'
import MockAdapter from 'axios-mock-adapter'
import tequilAPI from '../../../src/api/tequilapi'

const tequilApi = tequilAPI()

const mock = new MockAdapter(tequilApi.__axio)

describe('tequilAPI', () => {
  it('creates some new identity', async () => {
    mock.onPost('/identities').replyOnce(200, {id: '0xMOKFACE'})
    try {
      const newID = await tequilApi.identity.create('')
      expect(newID).to.be.eql({id: '0xMOKFACE'})
    } catch (err) {
      expect(err.message).to.be.undefined
    }
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
      expect(err.message).to.include('timeout')
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
