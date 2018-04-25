// @flow

export type HeaderRule = {
  urls: Array<string>,

  write(headers: Object): Object
}

function registerHeaderRules (browserSession: Object, rules: Array<HeaderRule>) {
  rules.forEach((rule) => {
    const {urls, write} = rule
    browserSession.webRequest.onBeforeSendHeaders({urls}, (details, next) => {
      next({requestHeaders: write(details.requestHeaders)})
    })
  })
}

export default registerHeaderRules
