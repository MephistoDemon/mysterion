import tequilapi from './tequilapi.js'
import mystCli from './myst_cli'

import tequilapiClient from '../../../api/tequilapi'

export default {
  tequilapi: tequilapi(tequilapiClient),
  myst_cli: mystCli
}
