// @flow
import type {Container} from '../../../app/di'
import {BrowserWindow} from 'electron'
import Window from '../../../app/window'

function bootstrap (container: Container) {
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)

  let browserWindow
  container.service(
    'mysterionBrowserWindow',
    [],
    () => {
      if (browserWindow) return browserWindow
      browserWindow = new BrowserWindow({
        resizable: false,
        show: false
      })
      return browserWindow
    }
  )
  container.service(
    'mysterionWindow',
    ['mysterionBrowserWindow'],
    (browserWindow) => {
      const url = process.env.NODE_ENV === 'development' ? `http://localhost:9080/` : `file://${__dirname}/index.html`

      return new Window(browserWindow, url)
    }
  )
}

export default bootstrap
