// @flow
import type {HeaderRewriteRules} from './index.js'

const rules: Array<HeaderRewriteRules> = [
  {
    urls: ['https://sentry.io/api/embed/error-page/*'],
    write: function (headers, next) {
      headers['Referer'] = '*'
      next(headers)
    }
  }
]

export default rules
