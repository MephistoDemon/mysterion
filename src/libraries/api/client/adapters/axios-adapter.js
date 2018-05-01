// @flow

import Axios from 'axios'
import type {HttpInterface, HttpQueryParams} from './interface'

class AxiosAdapter implements HttpInterface {
  _axios: Axios

  constructor (axios: Axios) {
    this._axios = axios
  }

  async get (path: string, query: ?HttpQueryParams, options: ?Object): Promise<?mixed> {
    options = options || {}
    if (query) {
      options['params'] = query
    }

    const response = await this._axios.get(path, options)

    return response.data
  }

  async post (path: string, data: mixed, options: ?Object): Promise<?mixed> {
    const response = await this._axios.post(path, data, options)

    return response.data
  }

  async delete (path: string, options: ?Object): Promise<?mixed> {
    const response = await this._axios.delete(path, options)

    return response.data
  }

  async put (path: string, data: mixed, options: ?Object): Promise<?mixed> {
    const response = await this._axios.put(path, data, options)

    return response.data
  }
}

export default AxiosAdapter
