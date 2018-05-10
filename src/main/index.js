// @flow
'use strict'

import dependencies from './dependencies'
import path from 'path'
import Mysterion from '../app/mysterion'
import mysterionConfig from '../app/mysterion-config'
import Terms from '../app/terms'
import {Installer as MysteriumDaemonInstaller, Process as MysteriumProcess} from '../libraries/mysterium-client'
import ProcessMonitoring from '../libraries/mysterium-client/monitoring'

global.__mysterionReleaseID = dependencies.get('mysterionReleaseID')
global.__static = mysterionConfig.staticDirectoryPath

const tequilApi = dependencies.get('tequilapiClient')
const mysterion = new Mysterion({
  browserWindowFactory: () => dependencies.get('mysterionBrowserWindow'),
  windowFactory: () => dependencies.get('mysterionWindow'),
  config: mysterionConfig,
  terms: new Terms(path.join(mysterionConfig.staticDirectoryPath, 'terms'), mysterionConfig.userDataDirectory),
  installer: new MysteriumDaemonInstaller(mysterionConfig),
  monitoring: new ProcessMonitoring(tequilApi),
  process: new MysteriumProcess(tequilApi, mysterionConfig.userDataDirectory),
  proposalFetcher: dependencies.get('proposalFetcher'),
  bugReporter: dependencies.get('bugReporter')
})

mysterion.run()
