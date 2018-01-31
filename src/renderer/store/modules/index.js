import main from './main'
import mystCli from './mystProcess'
import identity from './identity'
import proposal from './proposal'
import tequilAPI from '../../../api/tequilapi'
import connection from './connection'

const tequilapi = tequilAPI()

export default {
  main,
  connection,
  identity: identity(tequilapi),
  proposal: proposal(tequilapi),
  myst_cli: mystCli(tequilapi)
}
