import main from './main'
import connection from './connection'
import clientProcess from './clientProcess'
import terms from './terms'
import errors from './errors'
import identity from './identity'
import tequilAPI from '../../../libraries/api/tequilapi'

const tequilapi = tequilAPI()

export default {
  main,
  connection,
  errors,
  terms,
  identity: identity(tequilapi),
  clientProcess: clientProcess(tequilapi)
}
