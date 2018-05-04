// @flow
import type {HttpQueryParams} from '../adapters/interface'

class ProposalsFilter {
  providerId: string

  toQueryParams (): HttpQueryParams {
    throw new Error('Proposal filtering not implemented yet')
  }
}

export default ProposalsFilter
