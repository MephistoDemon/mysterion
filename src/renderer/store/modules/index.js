import tequilapi from './tequilapi.js'
import mystCli from './myst_cli'

import tequilapiClient from '../../../api/tequilapi'

/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

// const files = require.context('.', false, /\.js$/)
// const modules = {}
//
// files.keys().forEach(key => {
//   if (key === './index.js') return
//   modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
// })
//
// console.dir(modules)

// export default modules

export default {
  tequilapi: tequilapi(tequilapiClient),
  myst_cli: mystCli
}
//
// export [
//   tequilapiModule.Factory(),
//   tequilapiModule.Factory(),
// ]
