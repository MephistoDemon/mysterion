// @flow

import axios from 'axios'
import AxiosAdapter from './adapters/axios-adapter'
import TequilApi from './tequil-api'

export default function TequilApiFactory (baseUrl: string) {
  const axiosClient = axios.create({baseURL: baseUrl})
  const axiosAdapter = new AxiosAdapter(axiosClient)
  const tequilApi = new TequilApi(axiosAdapter)

  return tequilApi
}
