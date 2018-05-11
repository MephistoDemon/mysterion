// @flow
import type {Container} from '../../../app/di'
import {BrowserWindow} from 'electron'
import Window from '../../../app/window'
import FeedbackFormPlugin from '../../../app/bug-reporting/feedback-form-plugin'

function bootstrap (container: Container) {
  container.constant('mysterionReleaseID', `${process.env.MYSTERION_VERSION}(${process.env.BUILD_NUMBER})`)

  const singleton = true

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
    }, singleton)

  container.service(
    'mysterionWindow',
    ['mysterionBrowserWindow', 'feedbackForm.headerRule'],
    (browserWindow, rule) => {
      const url = process.env.NODE_ENV === 'development' ? `http://localhost:9080/` : `file://${__dirname}/index.html`

      const window = new Window(browserWindow, url)
      window.registerPlugin(new FeedbackFormPlugin(rule))
      return window
    }
  )
}

export default bootstrap
