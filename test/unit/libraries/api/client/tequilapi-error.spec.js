// @flow
import TequilapiError from '../../../../../src/libraries/api/client/tequilapi-error'

describe('tequilAPI', () => {
  describe('TequilapiError', () => {
    it('construct with parent exception', () => {
      const original = new Error('Failure message text')

      const error = new TequilapiError(original)
      expect(error.name).to.eql('TequilapiError')
      expect(error.message).to.eql(original.message)
      expect(error.trace).to.eql(original.trace)
    })

    it('isNetworkError()', () => {
      let original

      original = new Error('Network Error')
      expect(new TequilapiError(original).isNetworkError()).to.be.true

      original = new Error('Slow Network Error')
      expect(new TequilapiError(original).isNetworkError()).to.be.false
    })

    it('isTimeoutError()', () => {
      let original

      original = new Error()
      original.code = 'ECONNABORTED'
      expect(new TequilapiError(original).isTimeoutError()).to.be.true

      original = new Error()
      expect(new TequilapiError(original).isTimeoutError()).to.be.false
    })

    it('isRequestClosedError()', () => {
      let original

      original = new Error()
      original.response = {status: 499}
      expect(new TequilapiError(original).isRequestClosedError()).to.be.true

      original = new Error()
      expect(new TequilapiError(original).isRequestClosedError()).to.be.false
    })

    it('isRequestClosedError()', () => {
      let original

      original = new Error()
      original.response = {status: 503}
      expect(new TequilapiError(original).isServiceUnavailable()).to.be.true

      original = new Error()
      expect(new TequilapiError(original).isServiceUnavailable()).to.be.false
    })
  })
})
