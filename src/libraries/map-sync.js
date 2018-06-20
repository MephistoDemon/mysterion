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
  _metrics: Map<T, any> = new Map()
  _communication: ?MapSyncCommunication<T> = null

  syncWith (communication: MapSyncCommunication<T>): void {
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

  get (key: T): any {
    return this._metrics.get(key)
  }
}
