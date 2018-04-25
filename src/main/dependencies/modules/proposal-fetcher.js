// @flow

import ProposalFetcher from '../../../app/data-fetchers/proposal-fetcher'
import type {Container} from '../../../app/di/index'

function bootstrap (container: Container) {
  container.constant(
    'proposalFetcher.config',
    {
      'interval': 5000
    }
  )
  container.service(
    'proposalFetcher',
    ['tequilapiFlow', 'proposalFetcher.config'],
    (tequilapi, config: any) => {
      return new ProposalFetcher(tequilapi, config.interval)
    }
  )
}

export default bootstrap
