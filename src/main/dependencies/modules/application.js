// @flow
import type {Container} from '../../../app/di'
import {BrowserWindow} from 'electron'
import Window from '../../../app/window'

function bootstrap (container: Container) {
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)

  const browserWindowIsSingleton = true

  container.factory(
    'mysterionBrowserWindow',
    [],
    () => {
      return new BrowserWindow({
        resizable: false,
        show: false
      })
    }, browserWindowIsSingleton)

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
