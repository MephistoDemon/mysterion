import axios from 'axios/index'
import AxiosAdapter from '../../../../../src/libraries/mysterium-tequilapi/adapters/axios-adapter'
import MockAdapter from 'axios-mock-adapter'
import {capturePromiseError} from '../../../../helpers/utils'
import TequilapiError from '../../../../../src/libraries/mysterium-tequilapi/tequilapi-error'

describe('AxiosAdapter', () => {
  let adapter
  let mock
  beforeEach(() => {
    const axioInstance = axios.create()
    adapter = new AxiosAdapter(axioInstance, 1)
    mock = new MockAdapter(axioInstance)
  })

  it('handles get response', async () => {
    const responseExpected = {foo: 'bar'}
    mock.onGet('test-url').reply(200, responseExpected)

    const response = await adapter.get('test-url')
    expect(response).to.deep.equal(responseExpected)
  })

  it('handles post response', async () => {
    const requestExpected = {param: 'value'}
    const responseExpected = {foo: 'bar'}
    mock.onPost('test-url', requestExpected).reply(200, responseExpected)

    const response = await adapter.post('test-url', requestExpected)
    expect(response).to.deep.equal(responseExpected)
  })

  it('handles put response', async () => {
    const requestExpected = {param: 'value'}
    const responseExpected = {foo: 'bar'}
    mock.onPut('test-url', requestExpected).reply(200, responseExpected)

    const response = await adapter.put('test-url', requestExpected)
    expect(response).to.deep.equal(responseExpected)
  })

  it('handles delete response', async () => {
    const responseExpected = {foo: 'bar'}
    mock.onDelete('test-url').reply(200, responseExpected)

    const response = await adapter.delete('test-url')
    expect(response).to.deep.equal(responseExpected)
  })

  it('decorates network error', async () => {
    mock.onGet('test-url').networkError()

    const err = await capturePromiseError(adapter.get('test-url'))
    expect(err).to.be.instanceOf(TequilapiError)
    expect(err.isNetworkError()).to.be.true
  })

  it('decorates timeout error', async () => {
    mock.onGet('test-url').timeout()

    const err = await capturePromiseError(adapter.get('test-url'))
    expect(err).to.be.instanceOf(TequilapiError)
    expect(err.isTimeoutError()).to.be.true
  })

  it('decorates 404 response', async () => {
    mock.onGet('test-url').reply(404, {message: 'What is wrong'})

    const err = await capturePromiseError(adapter.get('test-url'))
    expect(err).to.be.instanceOf(TequilapiError)
    expect(err.message).to.be.equal('Request failed with status code 404')
  })
})
