// @flow

import axios from 'axios'
import AxiosAdapter from './adapters/axios-adapter'
import TequilapiClient from './client'
import {TIMEOUT_DEFAULT} from './timeouts'

const TEQUILAPI_URL = 'http://127.0.0.1:4050'

function tequilapiClientFactory (baseUrl: string = TEQUILAPI_URL, defaultTimeout: number = TIMEOUT_DEFAULT) {
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
