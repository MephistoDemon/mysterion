// @flow

import Axios from 'axios'
import {HttpInterface} from './interface'

class AxiosAdapter implements HttpInterface {
  axios: Axios

  constructor (axios: Axios) {
    this.axios = axios
  }

  async get (path: string, options: ?Object): Promise<?mixed> {
    const response = await this.axios.get(path, options)

    return response.data
  }

  async post (path: string, data: mixed, options: ?Object): Promise<?mixed> {
    const response = await this.axios.post(path, data, options)

    return response.data
  }

  async delete (path: string, options: ?Object): Promise<?mixed> {
    const response = await this.axios.delete(path, options)

    return response.data
  }

  async put (path: string, data: mixed, options: ?Object): Promise<?mixed> {
    const response = await this.axios.put(path, data, options)

    return response.data
  }
}

export default AxiosAdapter
