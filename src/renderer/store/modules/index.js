import main from './main'
import mystCli from './myst_cli'
import identity from './identity'
import proposal from './proposal'
import tequilAPI from '../../../api/tequilapi'

const tequilapi = tequilAPI()

export default {
  main,
  identity: identity(tequilapi),
  proposal: proposal(tequilapi),
  myst_cli: mystCli(tequilapi)
}
