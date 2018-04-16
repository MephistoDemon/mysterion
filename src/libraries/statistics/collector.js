// @flow

import axios from 'axios'
import {remote} from 'electron'

export type Event = {
  application_scope: string,
  event_name: string,
  context: any
}

export interface Collector {
  sendEvents (...events: Array<Event>): Promise<any>
}

export class ElkCollector implements Collector {
  _axiosApi: axios

  constructor (url: string) {
    this._axiosApi = axios.create({
      baseURL: url,
      timeout: 60000
    })
  }

  async sendEvents (...events: Array<Event>): Promise<any> {
    const res = await this._axiosApi.post('/', events)
    if ((res.status !== 200) || (res.data.toUpperCase() !== 'OK')) {
      throw new Error('Invalid response from ELK service: ' + res.status + ' : ' + res.data)
    }
  }
}

export function newEvent (name: string, context: any): Event {
  const appVersion = `${remote.getGlobal('__version')}(${remote.getGlobal('__buildNumber')})`
  return {
    application_scope: 'mysterion_application',
    application_version: appVersion,
    event_name: name,
    context: context
  }
}
