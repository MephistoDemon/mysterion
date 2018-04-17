// @flow
import applyHeaderWrites from '../../../../src/app/browserAJAXHeaderWriter'
import type {HeaderRewriteRules} from '../../../../src/app/browserAJAXHeaderWriter'

let resultHeaders
const next = headers => {
  resultHeaders = headers
}
let defaultHeaders

const fakeBrowserSession = {
  webRequest: {
    onBeforeSendHeaders: function (filter, callback) {
      callback(defaultHeaders, next)
    }
  }
}

const customRule: Array<HeaderRewriteRules> = [
  {
    urls: ['some url'],
    write: function (headers, next) {
      headers['CustomHeader'] = 'FakeHeader'
      next(headers)
    }
  },
  {
    urls: ['some other url'],
    write: function (headers, next) {
      headers['CustomOtherHeader'] = 'FakeOtherHeader'
      next(headers)
    }
  }
]

describe.only('browserRequestHeaderWriter', () => {
  beforeEach(() => {
    defaultHeaders = {requestHeaders: {}}
  })
  it('applies default headers', () => {
    applyHeaderWrites(fakeBrowserSession)
    expect(resultHeaders).to.be.eql({requestHeaders: {Referer: '*'}})
  })

  it('applies given headers', () => {
    applyHeaderWrites(fakeBrowserSession, customRule)
    expect(resultHeaders).to.be.eql({
      requestHeaders: {
        CustomHeader: 'FakeHeader',
        CustomOtherHeader: 'FakeOtherHeader'
      }
    })
  })
})
