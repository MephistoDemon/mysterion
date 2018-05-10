// @flow
import type {Container} from '../../../app/di'

function bootstrap (container: Container) {
  container.constant(
    'feedbackForm.headerRule',
    {
      urls: ['https://sentry.io/api/embed/error-page/*'],
      write: function (headers: Object): Object {
        headers['Referer'] = '*'
        return headers
      }
    }
  )
}

export default bootstrap
