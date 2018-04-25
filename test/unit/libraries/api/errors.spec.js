// @flow
import { hasHttpStatus } from '../../../../src/libraries/api/errors'
import { describe, it, expect } from '../../../helpers/dependencies'

class ResponseError extends Error {
  response: Object

  constructor (response: Object) {
    super()
    this.response = response
  }
}

function responseError (status) {
  return new ResponseError({ status })
}

describe('hasHttpStatus', () => {
  it('returns true when status equals', () => {
    const err = responseError(503)
    expect(hasHttpStatus(err, 503)).to.eql(true)
  })

  it('returns false when status differs', () => {
    const err = responseError(500)
    expect(hasHttpStatus(err, 503)).to.eql(false)
  })

  it('returns false when error has no response field', () => {
    const err = new Error('fake error')
    expect(hasHttpStatus(err, 503)).to.eql(false)
  })
})
