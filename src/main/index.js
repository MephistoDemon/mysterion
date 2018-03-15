'use strict'

import MysterionFactory from '../app/mysterion'
import MysterionConfig from '../app/mysterion-config'
import bugReporter from '../app/bug-reporting'

global.__version = process.env.MYSTERION_VERSION
global.__sentryURL = process.env.SENTRY.publicURL
global.__static = MysterionConfig.staticDirectoryPath

const mysterion = MysterionFactory(MysterionConfig, 'Cool terms', '1.0')
mysterion.run()

bugReporter.main.install()
