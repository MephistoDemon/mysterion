// @flow
'use strict'

import dependencies from './dependencies'

const mysterionConfig = dependencies.get('mysterionApplication.config')
global.__static = mysterionConfig.staticDirectory

const mysterion = dependencies.get('mysterionApplication')
mysterion.run()
