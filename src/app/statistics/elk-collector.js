// @flow
import axios from 'axios'
import type {Event, EventCollector} from './events'

class ElkCollector implements EventCollector {
  _axiosApi: axios

  constructor (url: string) {
    this._axiosApi = axios.create({
      baseURL: url,
      timeout: 60000
    })
  }

  async collectEvents (...events: Array<Event>): Promise<void> {
    const res = await this._axiosApi.post('/', events)
    if ((res.status !== 200) || (res.data.toUpperCase() !== 'OK')) {
      throw new Error('Invalid response from ELK service: ' + res.status + ' : ' + res.data)
    }
  }
}

export default ElkCollector
