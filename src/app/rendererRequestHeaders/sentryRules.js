// @flow
import type {HeaderRule} from './index.js'

const rules: Array<HeaderRule> = [
  {
    urls: ['https://sentry.io/api/embed/error-page/*'],
    write: function (headers) {
      headers['Referer'] = '*'
      return headers
    }
  }
]

export default rules
