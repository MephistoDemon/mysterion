// @flow
'use strict'

import dependencies from './dependencies'
import path from 'path'
import Mysterion from '../app/mysterion'
import mysterionConfig from '../app/mysterion-config'
import bugReporter from '../app/bugReporting/bug-reporting'
import Terms from '../app/terms'
import {Installer as MysteriumDaemonInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'

declare var SENTRY_CONFIG: Object

global.__version = process.env.MYSTERION_VERSION
global.__buildNumber = process.env.BUILD_NUMBER
global.__sentryURL = SENTRY_CONFIG.publicURL
global.__static = mysterionConfig.staticDirectoryPath

const tequilApi = dependencies.get('tequilapi')
const tequilapiDepreciated = dependencies.get('tequilapiDepreciated')
const mysterion = new Mysterion({
  config: mysterionConfig,
  terms: new Terms(path.join(mysterionConfig.staticDirectoryPath, 'terms'), mysterionConfig.userDataDirectory),
  installer: new MysteriumDaemonInstaller(mysterionConfig),
  monitoring: new ProcessMonitoring(tequilapiDepreciated),
  process: new MysteriumProcess(tequilApi, mysterionConfig.userDataDirectory),
  proposalFetcher: dependencies.get('proposalFetcher')
})

mysterion.run()

bugReporter.main.install()
