// @flow
import type {Container} from '../../../app/di'
import mysterionConfig from '../../../app/mysterion-config'
import Mysterion from '../../../app/mysterion'
import Terms from '../../../app/terms'
import path from 'path'
import {BrowserWindow} from 'electron'
import Window from '../../../app/window'

function bootstrap (container: Container) {
  container.constant('mysterionApplication.config', mysterionConfig)
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)

  container.service(
    'mysterionApplication',
    [
      'mysterionApplication.config',
      'mysteriumClientInstaller',
      'mysteriumClientProcess',
      'mysteriumClientMonitoring',
      'proposalFetcher',
      'bugReporter'
    ],
    (
      mysterionConfig,
      mysteriumClientInstaller,
      mysteriumClientProcess,
      mysteriumClientMonitoring,
      proposalFetcher,
      bugReporter
    ) => {
      return new Mysterion({
        config: mysterionConfig,
        browserWindowFactory: () => container.get('mysterionBrowserWindow'),
        windowFactory: () => container.get('mysterionWindow'),
        terms: new Terms(path.join(mysterionConfig.staticDirectoryPath, 'terms'), mysterionConfig.userDataDirectory),
        installer: mysteriumClientInstaller,
        process: mysteriumClientProcess,
        monitoring: mysteriumClientMonitoring,
        proposalFetcher: proposalFetcher,
        bugReporter: bugReporter
      })
    }
  )

  const browserWindowIsSingleton = true
  let browserWindow
  container.factory(
    'mysterionBrowserWindow',
    [],
    () => {
      browserWindow = new BrowserWindow({
        resizable: false,
        show: false
      })
      return browserWindow
    },
    browserWindowIsSingleton
  )

  container.service(
    'mysterionWindow',
    ['mysterionBrowserWindow', 'feedbackForm.headerRule'],
    (browserWindow, rule) => {
      const url = process.env.NODE_ENV === 'development' ? `http://localhost:9080/` : `file://${__dirname}/index.html`

      const window = new Window(browserWindow, url)
      window.registerRequestHeadersRule(rule)
      return window
    }
  )
}

export default bootstrap
