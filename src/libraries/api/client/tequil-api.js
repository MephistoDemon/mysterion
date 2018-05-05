// @flow

import type {HttpInterface} from './adapters/interface'
import ProposalDTO from './dto/proposal'
import ProposalsResponseDTO from './dto/proposals-response'
import ProposalsFilter from './dto/proposals-filter'
import IdentityDTO from './dto/identity'
import IdentitiesResponseDTO from './dto/identities-response'
import NodeHealthcheckDTO from './dto/node-healthcheck'
import ConnectionStatisticsDTO from './dto/connection-statistics'
import ConnectionIPDTO from './dto/connection-ip'

class TequilApi {
  http: HttpInterface

  constructor (http: HttpInterface) {
    this.http = http
  }

  async healthCheck (timeout: ?number) {
    const response = await this.http.get('healthcheck', null, timeout)

    return new NodeHealthcheckDTO(response)
  }

  async stop () {
    return this.http.post('stop')
  }

  async identitiesList (): Promise<Array<IdentityDTO>> {
    const response = await this.http.get('identities')
    const responseDto = new IdentitiesResponseDTO(response)

    return responseDto.identities
  }

  async identityCreate (passphrase: string): Promise<IdentityDTO> {
    const response = await this.http.post('identities', {passphrase})

    return new IdentityDTO(response)
  }

  async identityUnlock (id: string, passphrase: string): Promise<void> {
    await this.http.put('identities/' + id + '/unlock', {passphrase})
  }

  async findProposals (filter: ?ProposalsFilter): Promise<Array<ProposalDTO>> {
    const query = filter ? filter.toQueryParams() : null
    const response = await this.http.get('proposals', query)
    const responseDto = new ProposalsResponseDTO(response)

    return responseDto.proposals
  }

  async connectionIP (timeout: ?number): Promise<ConnectionIPDTO> {
    const response = await this.http.get('connection/ip', null, timeout)

    return new ConnectionIPDTO(response)
  }

  async connectionStatistics (): Promise<ConnectionStatisticsDTO> {
    const response = await this.http.get('connection/statistics')

    return new ConnectionStatisticsDTO(response)
  }
}

export default TequilApi
