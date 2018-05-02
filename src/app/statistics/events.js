// @flow

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
  collectEvents (...events: Array<Event>): Promise<void>
}

function newEvent (info: ApplicationInfo, name: string, createdAt: number, context: Object): Event {
  return {
    application: info,
    createdAt: createdAt,
    eventName: name,
    context: context
  }
}

function currentTime (): number {
  return new Date().getTime()
}

function createEventFactory (applicationInfo: ApplicationInfo): EventFactory {
  return function (name: string, context: Object) {
    return newEvent(applicationInfo, name, currentTime, context)
  }
}

export type {Event, ApplicationInfo, EventCollector}
export {newEvent, createEventFactory}
