// @flow

import axios from 'axios'
import AxiosAdapter from './adapters/axios-adapter'
import TequilApi from './tequil-api'

const DEFAULT_TIMEOUT = 5000

function factory (baseUrl: string, defaultTimeout: number = DEFAULT_TIMEOUT) {
  const axioInstance = axios.create({
    baseURL: baseUrl,
    timeout: defaultTimeout,
    headers: {
      'Cache-Control': 'no-cache, no-store'
    }
  })
  const axiosAdapter = new AxiosAdapter(axioInstance)

  return new TequilApi(axiosAdapter)
}

export default factory
