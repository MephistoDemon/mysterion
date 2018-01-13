import tequilapi from './tequilapi.js'
import mystCli from './myst_cli'
import tequila from '../../../api/tequilapi'

export default {
  tequilapi: tequilapi(tequila),
  myst_cli: mystCli
}
