import {expect} from 'chai'
import FakeAdapter from '../../../../../src/libraries/api/client/adapters/fake-adapter'
import ProposalDto from '../../../../../src/libraries/api/client/dto/proposal'
import TequilApi from '../../../../../src/libraries/api/client/tequil-api'

describe('tequilAPI', () => {
  describe('client', () => {
    let api
    let adapter

    before(() => {
      adapter = new FakeAdapter()
      api = new TequilApi(adapter)
    })

    it('.getProposals returns new proposal instances', async () => {
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
      adapter.setProposalsResponse(response)

      const proposals = await api.getProposals()
      expect(proposals).to.have.lengthOf(2)
      expect(proposals[0]).to.deep.equal(new ProposalDto(response.proposals[0]))
      expect(proposals[1]).to.deep.equal(new ProposalDto(response.proposals[1]))
    })

    it('.healthcheck', async () => {
      const response = {
        uptime: '1h10m',
        process: 1111,
        version: {
          commit: '0bcccc',
          branch: 'master',
          buildNumber: '001'
        }
      }
      adapter.setHealthcheckResponse(response)

      const healthcheck = await api.healthCheck()
      expect(healthcheck).to.deep.equal(response)
    })
  })
})
