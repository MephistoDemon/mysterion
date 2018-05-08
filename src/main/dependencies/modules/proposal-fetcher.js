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
    ['tequilapi', 'proposalFetcher.config'],
    (tequilapiFlow, config: any) => {
      return new ProposalFetcher(tequilapiFlow, config.interval)
    }
  )
}

export default bootstrap
