import ProposalDto from '../../../../../src/libraries/api/client/dto/proposal'
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
      expect(proposals[0]).to.deep.equal(new ProposalDto(response.proposals[0]))
      expect(proposals[1]).to.deep.equal(new ProposalDto(response.proposals[1]))
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
  })
})
