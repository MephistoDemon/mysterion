'use strict'

import MysterionFactory from '../app/mysterion'
import MysterionConfig from '../app/mysterion-config'
import bugReporter from '../app/bugReporting/bug-reporting'

global.__version = process.env.MYSTERION_VERSION
global.__buildNumber = process.env.BUILD_NUMBER
global.__sentryURL = process.env.SENTRY.publicURL
global.__static = MysterionConfig.staticDirectoryPath

const mysterion = MysterionFactory(MysterionConfig)
mysterion.run()

bugReporter.main.install()
