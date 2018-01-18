import tequilStore from './tequil.js'
import mystCli from './myst_cli'
import tequilAPI from '../../../api/tequilapi'

export default {
  tequil: tequilStore(tequilAPI()),
  myst_cli: mystCli
}
