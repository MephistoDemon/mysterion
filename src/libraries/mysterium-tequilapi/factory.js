// @flow

import axios from 'axios'
import AxiosAdapter from './adapters/axios-adapter'
import TequilApi from './tequil-api'
import {TIMEOUT_DEFAULT} from './timeouts'

function factory (baseUrl: string, defaultTimeout: number = TIMEOUT_DEFAULT) {
  const axioInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Cache-Control': 'no-cache, no-store'
    }
  })
  const axiosAdapter = new AxiosAdapter(axioInstance, defaultTimeout)

  return new TequilApi(axiosAdapter)
}

export default factory
