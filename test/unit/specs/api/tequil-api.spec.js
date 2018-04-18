import {expect} from 'chai'
import FakeAdapter from '../../../../src/libraries/api/client/adapters/fake-adapter'
import ProposalDto from '../../../../src/libraries/api/client/dto/proposal'
import TequilApi from '../../../../src/libraries/api/client/tequil-api'

describe('TequilApi', () => {
  describe('client', () => {
    const proposals = {
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

    const healthcheck = {
      uptime: '1h10m',
      process: 1111,
      version: {
        commit: '0bcccc',
        branch: 'master',
        buildNumber: '001'
      }
    }

    const adapter = new FakeAdapter()
    adapter.setProposalsResponse(proposals)
    adapter.setHealthcheckResponse(healthcheck)

    const api = new TequilApi(adapter)

    it('.getProposals returns new proposal instances', async () => {
      const response = await api.getProposals()
      expect(response[0]).to.deep.equal(new ProposalDto(proposals.proposals[0]))
      expect(response[1]).to.deep.equal(new ProposalDto(proposals.proposals[1]))
    })

    it('.healthcheck', async () => {
      const response = await api.healthCheck()
      expect(response).to.deep.equal(healthcheck)
    })
  })
})
