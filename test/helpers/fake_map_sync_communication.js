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

import type {Metric} from '../../src/app/bug-reporting/bug-reporter-metrics'
import type {MapSyncCommunication, MapSyncDTO} from '../../src/libraries/map-sync'

/**
 * Allows tracking method invocations.
 */
class FakeMapSyncCommunication implements MapSyncCommunication<Metric> {
  _mapUpdateCallbacks: Set<MapSyncDTO<Metric> => void> = new Set()

  sendMapUpdate (data: MapSyncDTO<Metric>): void {
    for (let callback of this._mapUpdateCallbacks) {
      callback(data)
    }
  }

  onMapUpdate (callback: (MapSyncDTO<Metric> => void)): void {
    this._mapUpdateCallbacks.add(callback)
  }
}

export default FakeMapSyncCommunication
