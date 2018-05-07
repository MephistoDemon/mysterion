// @flow
'use strict'

import dependencies from './dependencies'

const mysterionConfig = dependencies.get('mysterionApplication.config')
global.__mysterionReleaseID = dependencies.get('mysterionReleaseID')
global.__static = mysterionConfig.staticDirectoryPath

const mysterion = dependencies.get('mysterionApplication')
mysterion.run()
