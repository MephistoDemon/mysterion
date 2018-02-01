import main from './main'
import connection from './connection'
import mystCli from './mystProcess'
import identity from './identity'
import proposal from './proposal'
import tequilAPI from '../../../api/tequilapi'

const tequilapi = tequilAPI()

export default {
  main,
  connection: connection(tequilapi),
  identity: identity(tequilapi),
  proposal: proposal(tequilapi),
  myst_cli: mystCli(tequilapi)

}
