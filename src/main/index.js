'use strict'

import MysterionFactory from '../app/mysterion'
import MysterionConfig from '../app/mysterion-config'

global.__static = MysterionConfig.staticDirectoryPath

const mysterion = MysterionFactory(MysterionConfig, 'Cool terms', 1.0)
mysterion.run()
