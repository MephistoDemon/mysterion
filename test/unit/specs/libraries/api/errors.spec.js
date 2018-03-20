import { haveHttpStatus } from '../../../../../src/libraries/api/errors'

function responseError (status) {
  const error = new Error()
  error.response = { status }
  return error
}

describe('haveHttpStatus', () => {
  it('returns true when status equals', () => {
    const err = responseError(503)
    expect(haveHttpStatus(err, 503)).to.eql(true)
  })

  it('returns false when status differs', () => {
    const err = responseError(500)
    expect(haveHttpStatus(err, 503)).to.eql(false)
  })

  it('returns false when error has no response field', () => {
    const err = new Error('fake error')
    expect(haveHttpStatus(err, 503)).to.eql(false)
  })
})
