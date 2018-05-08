// @flow
'use strict'

import dependencies from './dependencies'
import path from 'path'
import Mysterion from '../app/mysterion'
import mysterionConfig from '../app/mysterion-config'
import Terms from '../app/terms'
import {Installer as MysteriumDaemonInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'

dependencies.get('bugReporter')
  .install(dependencies.get('sentryURL'), dependencies.get('mysterionReleaseID'))

global.__mysterionReleaseID = dependencies.get('mysterionReleaseID')
global.__static = mysterionConfig.staticDirectoryPath

const tequilApi = dependencies.get('tequilapi')
const mysterion = new Mysterion({
  config: mysterionConfig,
  terms: new Terms(path.join(mysterionConfig.staticDirectoryPath, 'terms'), mysterionConfig.userDataDirectory),
  installer: new MysteriumDaemonInstaller(mysterionConfig),
  monitoring: new ProcessMonitoring(tequilApi),
  process: new MysteriumProcess(tequilApi, mysterionConfig.userDataDirectory),
  proposalFetcher: dependencies.get('proposalFetcher'),
  bugReporter: dependencies.get('bugReporter')
})

mysterion.run()
