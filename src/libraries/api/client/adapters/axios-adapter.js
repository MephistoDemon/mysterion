// @flow

import Axios from 'axios'
import type {HttpInterface, HttpQueryParams} from './interface'

class AxiosAdapter implements HttpInterface {
  _axios: Axios

  constructor (axios: Axios) {
    this._axios = axios
  }

  async get (path: string, query: ?HttpQueryParams, timeout: ?number): Promise<?mixed> {
    const options = {
      params: query,
      timeout
    }
    const response = await this._axios.get(path, options)

    return response.data
  }

  async post (path: string, data: mixed, timeout: ?number): Promise<?mixed> {
    const response = await this._axios.post(path, data, {timeout})

    return response.data
  }

  async delete (path: string, timeout: ?number): Promise<?mixed> {
    const response = await this._axios.delete(path, {timeout})

    return response.data
  }

  async put (path: string, data: mixed, timeout: ?number): Promise<?mixed> {
    const response = await this._axios.put(path, data, {timeout})

    return response.data
  }
}

export default AxiosAdapter
