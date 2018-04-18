// @flow
import {session} from 'electron'
import defaultRules from './sentryRules'

export type HeaderRule = {
  urls: Array<string>,

  write(headers: Object): Object
}

function registerHeaderRule (browserSession: Object, rule: HeaderRule) {
  const {urls, write} = rule
  browserSession.webRequest.onBeforeSendHeaders({urls}, (details, next) => {
    next({requestHeaders: write(details.requestHeaders)})
  })
}

function registerHeaderRules (
  browserSession?: Object = session.defaultSession,
  rules: Array<HeaderRule> = defaultRules
) {
  rules.forEach((rule) => {
    registerHeaderRule(browserSession, rule)
  })
}

export default registerHeaderRules
