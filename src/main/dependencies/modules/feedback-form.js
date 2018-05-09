// @flow
import type {Container} from '../../../app/di'
import {configInstallerWithRules} from '../../../app/bugReporting/feedback-form'

function bootstrap (container: Container) {
  container.constant(
    'feedbackForm.headerRule',
    {
      urls: ['https://sentry.io/api/embed/error-page/*'],
      write: function (headers: Object): Object {
        headers['Referer'] = '*'
        return headers
      }
    })

  container.service(
    'feedbackForm.install',
    ['feedbackForm.headerRule'],
    (headerRule) => {
      return configInstallerWithRules(headerRule)
    }
  )
}

export default bootstrap
