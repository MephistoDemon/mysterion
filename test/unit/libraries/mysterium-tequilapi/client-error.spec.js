// @flow
import TequilapiClientError from '../../../../src/libraries/mysterium-tequilapi/client-error'
import { describe, it, expect } from '../../../helpers/dependencies'

describe('TequilapiClientError', () => {
  it('construct with parent exception', () => {
    const original = new Error('Failure message text')

    const error = new TequilapiClientError(original)
    expect(error.name).to.eql('TequilapiClientError')
    expect(error.message).to.eql(original.message)
    expect(error.trace).to.eql(original.trace)
  })

  it('isNetworkError()', () => {
    let original

    original = new Error('Network Error')
    expect(new TequilapiClientError(original).isNetworkError()).to.be.true

    original = new Error('Slow Network Error')
    expect(new TequilapiClientError(original).isNetworkError()).to.be.false
  })

  it('isTimeoutError()', () => {
    let original

    original = (new Error(): Object)
    original.code = 'ECONNABORTED'
    expect(new TequilapiClientError(original).isTimeoutError()).to.be.true

    original = new Error()
    expect(new TequilapiClientError(original).isTimeoutError()).to.be.false
  })

  it('isRequestClosedError()', () => {
    let original

    original = (new Error(): Object)
    original.response = {status: 499}
    expect(new TequilapiClientError(original).isRequestClosedError()).to.be.true

    original = new Error()
    expect(new TequilapiClientError(original).isRequestClosedError()).to.be.false
  })

  it('isServiceUnavailableError()', () => {
    let original

    original = (new Error(): Object)
    original.response = {status: 503}
    expect(new TequilapiClientError(original).isServiceUnavailableError()).to.be.true

    original = new Error()
    expect(new TequilapiClientError(original).isServiceUnavailableError()).to.be.false
  })
})
