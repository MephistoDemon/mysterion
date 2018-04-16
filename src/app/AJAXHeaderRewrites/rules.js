// @flow
import type {HeaderRewriteRules} from './index.js'

const rules: Array<HeaderRewriteRules> = [
  {
    filter: {urls: ['https://sentry.io/api/embed/error-page/*']},
    rewriter: function (headers, next) {
      headers['Referer'] = '*'
      next({requestHeaders: headers})
    }
  }
]

export default rules
