// @flow

import Axios from 'axios'
import type {HttpInterface, HttpQueryParams} from './interface'
import TequilapiClientError from '../client-error'
import {TIMEOUT_DEFAULT} from '../timeouts'

class AxiosAdapter implements HttpInterface {
  _axios: Axios
  _timeout: number

  constructor (axios: Axios, defaultTimeout: number = TIMEOUT_DEFAULT) {
    this._axios = axios
    this._timeout = defaultTimeout
  }

  get (path: string, query: ?HttpQueryParams, timeout: ?number): Promise<?mixed> {
    const options = this._decorateOptions(timeout)
    options.params = query

    return decorateResponse(
      this._axios.get(path, options)
    )
  }

  post (path: string, data: mixed, timeout: ?number): Promise<?mixed> {
    return decorateResponse(
      this._axios.post(path, data, this._decorateOptions(timeout))
    )
  }

  delete (path: string, timeout: ?number): Promise<?mixed> {
    return decorateResponse(
      this._axios.delete(path, this._decorateOptions(timeout))
    )
  }

  put (path: string, data: mixed, timeout: ?number): Promise<?mixed> {
    return decorateResponse(
      this._axios.put(path, data, this._decorateOptions(timeout))
    )
  }

  _decorateOptions (timeout: ?number): Object {
    return {
      timeout: timeout !== undefined ? timeout : this._timeout
    }
  }
}

function decorateResponse (promise: Promise<Object>): Promise<Object> {
  return promise
    .then((response: Object) => {
      return Promise.resolve(response.data)
    }).catch((error: Error) => {
      return Promise.reject(new TequilapiClientError(error))
    })
}

export default AxiosAdapter
