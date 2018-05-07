// @flow
'use strict'

import dependencies from './dependencies'
import path from 'path'
import Mysterion from '../app/mysterion'
import mysterionConfig from '../app/mysterion-config'
import Terms from '../app/terms'

global.__mysterionReleaseID = dependencies.get('mysterionReleaseID')
global.__static = mysterionConfig.staticDirectoryPath

const mysterion = new Mysterion({
  browserWindowFactory: () => dependencies.get('mysterionBrowserWindow'),
  windowFactory: () => dependencies.get('mysterionWindow'),
  config: mysterionConfig,
  terms: new Terms(path.join(mysterionConfig.staticDirectoryPath, 'terms'), mysterionConfig.userDataDirectory),
  installer: dependencies.get('mysteriumClientInstaller'),
  monitoring: dependencies.get('mysteriumClientMonitoring'),
  process: dependencies.get('mysteriumClientProcess'),
  proposalFetcher: dependencies.get('proposalFetcher'),
  bugReporter: dependencies.get('bugReporter')
})

mysterion.run()
