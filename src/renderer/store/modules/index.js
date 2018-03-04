import main from './main'
import connection from './connection'
import clientProcess from './clientProcess'
import identity from './identity'
import proposal from './proposal'
import tequilAPI from '../../../api/tequilapi'

const tequilapi = tequilAPI()

export default {
  main,
  connection,
  identity: identity(tequilapi),
  proposal: proposal(tequilapi),
  clientProcess: clientProcess(tequilapi)
}
