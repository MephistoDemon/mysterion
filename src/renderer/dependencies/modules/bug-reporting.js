/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import type {Container} from '../../../app/di'
import BugReporterRenderer from '../../../app/bug-reporting/bug-reporter-renderer'
import {FeedbackForm} from '../../../app/bug-reporting/feedback-form'
import RavenJs from 'raven-js'
import Vue from 'vue'
import RavenVue from 'raven-js/plugins/vue'

function bootstrap (container: Container) {
  container.constant('bugReporter.sentryURL', 'https://f1e63dd563c34c35a56e98aa02518d40@sentry.io/300978')

  container.factory(
    'bugReporter',
    ['bugReporter.raven', 'rendererCommunication'],
    (raven, rendererCommunication) => {
      const bugReporter = new BugReporterRenderer(raven)
      window.addEventListener('unhandledrejection', (evt) => {
        bugReporter.captureErrorMessage(evt.reason, evt.reason.response ? evt.reason.response.data : evt.reason)
      })

      rendererCommunication.onMysteriumClientLog(({ level, data }) => {
        bugReporter.pushToLogCache(level, data)
      })

      return bugReporter
    }
  )

  container.service(
    'bugReporter.raven',
    ['bugReporter.sentryURL', 'bugReporter.config'],
    (sentryURL, config) => {
      return RavenJs
        .config(sentryURL, config)
        .install()
        .addPlugin(RavenVue, Vue)
    }
  )

  container.service(
    'feedbackForm',
    ['bugReporter.raven'],
    (raven) => new FeedbackForm(raven))
}

export default bootstrap
