// @flow

type HeaderRule = {
  urls: Array<string>,

  write(headers: Object): Object
}

function registerHeaderRules (browserSession: Object, rule: HeaderRule) {
  const {urls, write} = rule
  browserSession.webRequest.onBeforeSendHeaders({urls}, (details, next) => {
    next({requestHeaders: write(details.requestHeaders)})
  })
}

export default registerHeaderRules
export type { HeaderRule }
