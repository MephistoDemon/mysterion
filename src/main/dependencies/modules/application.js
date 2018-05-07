// @flow
import {app, BrowserWindow} from 'electron'
import type {Container} from '../../../app/di'
import Mysterion from '../../../app/mysterion'
import Terms from '../../../app/terms'
import path from 'path'
import Window from '../../../app/window'

function bootstrap (container: Container) {
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)
  container.service(
    'mysterionApplication.config',
    [],
    () => {
      const inDevMode = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing'

      let contentsDirectory = path.resolve(app.getAppPath(), '../../')
      if (inDevMode) {
        // path from this file
        contentsDirectory = path.resolve(__dirname, '../../../../')
      }

      let staticDirectory = path.join(app.getAppPath(), '../', 'static')
      if (inDevMode) {
        // path from this file
        staticDirectory = path.resolve(__dirname, '../../../../static')
      }

      return {
        /**
         * mysterium_client binary path
         */
        clientBinaryPath: path.join(contentsDirectory, 'bin', 'mysterium_client'),

        /**
         * openvpn binary path
         */
        openVPNBinary: path.join(contentsDirectory, 'bin', 'openvpn'),

        /**
         * mysterium_client configuration files directory
         *
         * e.g. openvpn DNS resolver script
         */
        clientConfigPath: path.join(contentsDirectory, 'bin', 'config'),

        /**
         * user data directory
         *
         * This should store logs, terms and conditions file, mysterium_client data, etc
         */
        userDataDirectory: app.getPath('userData'),

        /**
         * runtime/working directory
         *
         * used for storing temp files
         */
        runtimeDirectory: app.getPath('temp'),

        /**
         * static file directory
         */
        staticDirectoryPath: staticDirectory.replace(/\\/g, '\\\\'),

        /**
         * window configuration
         */
        windows: {
          terms: {
            width: 800,
            height: 650
          },
          app: {
            width: 650,
            height: 650
          }
        }
      }
    }
  )

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
