// @flow
'use strict'

import dependencies from './dependencies'
import mysterionConfig from '../app/mysterion-config'

global.__mysterionReleaseID = dependencies.get('mysterionReleaseID')
global.__static = mysterionConfig.staticDirectoryPath

const mysterion = dependencies.get('mysterionApplication')
mysterion.run()
