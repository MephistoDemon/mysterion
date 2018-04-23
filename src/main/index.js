// @flow

'use strict'

import path from 'path'
import Mysterion from '../app/mysterion'
import MysterionConfig from '../app/mysterion-config'
import bugReporter from '../app/bugReporting/bug-reporting'
import Terms from '../app/terms'
import TequilAPI from '../libraries/api/tequilapi'
import {Installer as MysteriumDaemonInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'

declare var SENTRY_CONFIG: Object

global.__version = process.env.MYSTERION_VERSION
global.__buildNumber = process.env.BUILD_NUMBER
global.__sentryURL = SENTRY_CONFIG.publicURL
global.__static = MysterionConfig.staticDirectoryPath

const tequilApi = new TequilAPI()

const mysterion = new Mysterion({
  config: MysterionConfig,
  terms: new Terms(path.join(MysterionConfig.staticDirectoryPath, 'terms'), MysterionConfig.userDataDirectory),
  installer: new MysteriumDaemonInstaller(MysterionConfig),
  monitoring: new ProcessMonitoring(tequilApi),
  process: new MysteriumProcess(tequilApi, MysterionConfig.userDataDirectory)
})

mysterion.run()

bugReporter.main.install()
