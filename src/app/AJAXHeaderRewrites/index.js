// @flow
import {session} from 'electron'
import defaultRules from './rules'

export interface HeaderRewriteRules {
  filter: { urls: Array<string> },

  rewriter(headers: Object, next: Function): void
}

function onBeforeSendHeaders (session: Object, rule: HeaderRewriteRules) {
  const {filter, rewriter} = rule
  session.webRequest.onBeforeSendHeaders(filter, (details, next) => {
    rewriter(details.requestHeaders, next)
  })
}

function applyHeaderRewrites (
  rules?: Array<HeaderRewriteRules> = defaultRules,
  browserSession?: Object = session.defaultSession
) {
  rules.forEach((rule) => {
    onBeforeSendHeaders(browserSession, rule)
  })
}

export default applyHeaderRewrites
