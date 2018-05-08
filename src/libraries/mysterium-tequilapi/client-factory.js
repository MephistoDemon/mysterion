// @flow

import axios from 'axios'
import AxiosAdapter from './adapters/axios-adapter'
import TequilapiClient from './client'
import {TIMEOUT_DEFAULT} from './timeouts'

function tequilapiClientFactory (baseUrl: string, defaultTimeout: number = TIMEOUT_DEFAULT) {
  const axioInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Cache-Control': 'no-cache, no-store'
    }
  })
  const axiosAdapter = new AxiosAdapter(axioInstance, defaultTimeout)

  return new TequilapiClient(axiosAdapter)
}

export default tequilapiClientFactory
