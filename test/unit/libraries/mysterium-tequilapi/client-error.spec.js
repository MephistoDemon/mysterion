// @flow
import { isNetworkError, isTimeoutError, isRequestClosedError, isServiceUnavailableError } from '../../../../src/libraries/mysterium-tequilapi/client-error'
import { describe, it, expect } from '../../../helpers/dependencies'

describe('errors', () => {
  // TODO: change `it` descriptions to declare behaviour, not method names
  it('isNetworkError()', () => {
    let error

    error = new Error('Network Error')
    expect(isNetworkError(error)).to.be.true

    error = new Error('Slow Network Error')
    expect(isNetworkError(error)).to.be.false
  })

  it('isTimeoutError()', () => {
    let error

    error = (new Error(): Object)
    error.code = 'ECONNABORTED'
    expect(isTimeoutError(error)).to.be.true

    error = new Error()
    expect(isTimeoutError(error)).to.be.false
  })

  it('isRequestClosedError()', () => {
    let error

    error = (new Error(): Object)
    error.response = {status: 499}
    expect(isRequestClosedError(error)).to.be.true

    error = new Error()
    expect(isRequestClosedError(error)).to.be.false
  })

  it('isServiceUnavailableError()', () => {
    let error

    error = (new Error(): Object)
    error.response = {status: 503}
    expect(isServiceUnavailableError(error)).to.be.true

    error = new Error()
    expect(isServiceUnavailableError(error)).to.be.false
  })
})
