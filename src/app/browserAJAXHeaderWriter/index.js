// @flow
import {session} from 'electron'
import defaultRules from './rules'

export type HeaderRewriteRules = {
  urls: Array<string>,

  write(headers: Object, next: Function): void
}

function registerHeaderWriteRule (session: Object, rule: HeaderRewriteRules) {
  const {urls, write} = rule
  session.webRequest.onBeforeSendHeaders({urls}, (details, next) => {
    write(details.requestHeaders, next)
  })
}

function applyHeaderWrites (
  browserSession?: Object = session.defaultSession,
  rules?: Array<HeaderRewriteRules> = defaultRules
) {
  rules.forEach((rule) => {
    registerHeaderWriteRule(browserSession, rule)
  })
}

export default applyHeaderWrites
