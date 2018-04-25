// @flow
import {describe, it, expect, before} from '../../../helpers/dependencies'
import applyHeaderWrites from '../../../../src/app/rendererRequestHeaders'
import type {HeaderRule} from '../../../../src/app/rendererRequestHeaders'

let resultHeaders
let defaultHeaders

const fakeBrowserSession = {
  webRequest: {
    onBeforeSendHeaders: function (filter, callback) {
      callback(defaultHeaders, headers => {
        resultHeaders = headers
      })
    }
  }
}

const customRules: Array<HeaderRule> = [
  {
    urls: ['some url'],
    write: function (headers) {
      headers['CustomHeader'] = 'FakeHeader'
      return headers
    }
  },
  {
    urls: ['some other url'],
    write: function (headers) {
      headers['CustomOtherHeader'] = 'FakeOtherHeader'
      return headers
    }
  }
]

describe('registerHeaderRules', () => {
  before(() => {
    defaultHeaders = {requestHeaders: {}}
  })

  it('applies given headers', () => {
    applyHeaderWrites(fakeBrowserSession, customRules)
    expect(resultHeaders).to.be.eql({
      requestHeaders: {
        CustomHeader: 'FakeHeader',
        CustomOtherHeader: 'FakeOtherHeader'
      }
    })
  })
})
