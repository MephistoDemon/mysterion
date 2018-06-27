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

export type MapSyncDTO<T: string> = {
  metric: T,
  value: mixed
}

export interface MapSyncCommunication<T: string> {
  sendMapUpdate (update: MapSyncDTO<T>): void,
  onMapUpdate (callback: (MapSyncDTO<T>) => void): void
}

export class MapSync<T: string> {
  _metrics: Map<T, mixed> = new Map()
  _communication: ?MapSyncCommunication<T> = null

  startSyncing (communication: MapSyncCommunication<T>): void {
    this._communication = communication
    this._communication.onMapUpdate(dto => {
      this.set(dto.metric, dto.value)
    })
  }

  set (key: T, value: mixed): void {
    const oldValue = this._metrics.get(key)
    if (JSON.stringify(oldValue) === JSON.stringify(value)) {
      // metric's value was not updated
      return
    }

    this._metrics.set(key, value)

    if (this._communication) {
      this._communication.sendMapUpdate({
        metric: key,
        value: value
      })
    }
  }

  get (key: T): mixed {
    return this._metrics.get(key)
  }
}
