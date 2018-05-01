import ProposalDTO from '../../../../../src/libraries/api/client/dto/proposal'
import TequilApi from '../../../../../src/libraries/api/client/tequil-api'
import AxiosAdapter from '../../../../../src/libraries/api/client/adapters/axios-adapter'
import axios from 'axios/index'
import MockAdapter from 'axios-mock-adapter'
import {capturePromiseError} from '../../../../helpers/utils'

describe('tequilAPI', () => {
  let api
  let mock
  beforeEach(() => {
    const axioInstance = axios.create()
    api = new TequilApi(new AxiosAdapter(axioInstance))
    mock = new MockAdapter(axioInstance)
  })

  describe('client.findProposals()', () => {
    it('returns proposals instances', async () => {
      const response = {
        proposals: [{
          id: 1,
          providerId: '0x0',
          serviceType: 'openvpn',
          serviceDefinition: {
            locationOriginate: {
              asn: '',
              country: 'NL'
            }
          }
        }, {
          id: 1,
          providerId: '0x1',
          serviceType: 'openvpn',
          serviceDefinition: {
            locationOriginate: {
              asn: '',
              country: 'LT'
            }
          }
        }]
      }
      mock.onGet('proposals').reply(200, response)

      const proposals = await api.findProposals()
      expect(proposals).to.have.lengthOf(2)
      expect(proposals[0]).to.deep.equal(new ProposalDTO(response.proposals[0]))
      expect(proposals[1]).to.deep.equal(new ProposalDTO(response.proposals[1]))
    })

    it('handles error', async () => {
      mock.onGet('proposals').reply(500)

      const e = await capturePromiseError(api.findProposals())
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })

  describe('client.healthcheck()', () => {
    it('returns response', async () => {
      const response = {
        uptime: '1h10m',
        process: 1111,
        version: {
          commit: '0bcccc',
          branch: 'master',
          buildNumber: '001'
        }
      }
      mock.onGet('healthcheck').reply(200, response)

      const healthcheck = await api.healthCheck()
      expect(healthcheck).to.deep.equal(response)
    })

    it('throws network error', async () => {
      mock.onGet('/healthcheck').networkError()

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.eql('Network Error')
    })

    it('throws timeout', async () => {
      mock.reset()
      mock.onGet('/healthcheck').timeout()

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.match(/timeout of .*ms exceeded/)
    })

    it('throws 404', async () => {
      mock.reset()
      mock.onGet('/healthcheck').reply(404, {message: 'What is wrong'})

      const err = await capturePromiseError(api.healthCheck())
      expect(err.message).to.eql('Request failed with status code 404')
      expect(err.response.data.message).to.eql('What is wrong')
    })
  })

  describe('client.stop()', () => {
    it('success', async () => {
      mock.onPost('stop').reply(200)

      const response = await api.stop()
      expect(response).to.be.undefined
    })

    it('handles error', async () => {
      mock.onPost('stop').reply(500)

      const e = await capturePromiseError(api.stop())
      expect(e.message).to.equal('Request failed with status code 500')
    })
  })
})
