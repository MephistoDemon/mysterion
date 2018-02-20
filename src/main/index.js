'use strict'

import MysterionFactory from '../libraries/mysterion'
import MysterionConfig from '../libraries/mysterion-config'

global.__static = MysterionConfig.staticDirectoryPath

const mysterion = MysterionFactory(MysterionConfig, 'Cool mysterion terms', 1.0)
mysterion.run()
