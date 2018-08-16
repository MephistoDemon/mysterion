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

import type { Container } from '../app/di'
import ElkCollector from '../app/statistics/elk-collector'
import AggregatingCollector from '../app/statistics/aggregating-collector'
import type { ApplicationInfo, EventCollector, EventFactory } from '../app/statistics/events'
import { createEventFactory } from '../app/statistics/events'
import NullCollector from '../app/statistics/null-collector'
import CollectorEventSender from '../app/statistics/collector-event-sender'
import type { EventSender } from '../app/statistics/event-sender'

function bootstrap (container: Container) {
  container.service(
    'statsApplicationInfo',
    ['mysterionReleaseID'],
    (mysterionReleaseID) => {
      return {
        name: 'mysterion_application',
        version: mysterionReleaseID
      }
    }
  )

  container.service(
    'eventFactory',
    ['statsApplicationInfo'],
    (applicationInfo: ApplicationInfo): EventFactory => {
      return createEventFactory(applicationInfo)
    }
  )

  container.service(
    'eventCollector',
    [],
    (): EventCollector => {
      if (process.env.NODE_ENV === 'production') {
        const elkCollector = new ElkCollector('http://metrics.mysterium.network:8091')
        return new AggregatingCollector(elkCollector, 10)
      }

      return new NullCollector()
    }
  )

  container.service(
    'eventSender',
    ['eventCollector', 'eventFactory'],
    (eventCollector, eventFactory): EventSender => {
      return new CollectorEventSender(eventCollector, eventFactory)
    }
  )
}

export default bootstrap
