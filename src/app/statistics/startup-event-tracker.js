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

import type { EventCollector, EventFactory } from './events'
import os from 'os'

const STARTUP_EVENT_NAME = 'startup'

/**
 * Generates and sends startup event.
 */
class StartupEventTracker {
  _eventCollector: EventCollector
  _eventFactory: EventFactory

  constructor (eventCollector: EventCollector, eventFactory: EventFactory) {
    this._eventCollector = eventCollector
    this._eventFactory = eventFactory
  }

  startup () {
    const context = { platform: os.platform() }
    this._sendEvent(STARTUP_EVENT_NAME, context)
  }

  // TODO: reuse this abstraction for connection events
  _sendEvent (name: string, details: Object) {
    const event = this._eventFactory(name, details)
    this._eventCollector.collectEvents(event)
  }
}

export default StartupEventTracker
