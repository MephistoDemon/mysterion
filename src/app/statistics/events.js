/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

type EventFactory = (name: string, details: Object) => Event

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
    return newEvent(applicationInfo, name, currentTime(), context)
  }
}

export type {Event, ApplicationInfo, EventFactory, EventCollector}
export {newEvent, createEventFactory}
