// @flow

import axios from 'axios'

type ApplicationInfo = {
  name: string,
  version: string
}

type Event = {
  application: ApplicationInfo,
  createdAt: number,
  eventName: string,
  context: any
}

interface EventCollector {
  collectEvents (...events: Array<Event>): Promise<any>
}

class ElkCollector implements EventCollector {
  _axiosApi: axios

  constructor (url: string) {
    this._axiosApi = axios.create({
      baseURL: url,
      timeout: 60000
    })
  }

  async collectEvents (...events: Array<Event>): Promise<any> {
    const res = await this._axiosApi.post('/', events)
    if ((res.status !== 200) || (res.data.toUpperCase() !== 'OK')) {
      throw new Error('Invalid response from ELK service: ' + res.status + ' : ' + res.data)
    }
  }
}

function newEvent (info: ApplicationInfo, name: string, createdAt: number, context: any): Event {
  return {
    application: info,
    createdAt: createdAt,
    eventName: name,
    context: context
  }
}

export type {Event, EventCollector, ApplicationInfo}
export {ElkCollector, newEvent}
