// @flow

import type {MessageBus} from '../app/communication/messageBus'
import type {MapSyncDTO} from '../app/communication/dto'
import messages from '../app/communication/messages'

class MapSync<T: string> {
  _metrics: Map<T, any> = new Map()
  _messageBus: ?MessageBus = null

  syncWith (messageBus: MessageBus): void {
    this._messageBus = messageBus
    this._messageBus.on(messages.MAP_SYNC, data => {
      const maybeDto = (data: any)
      if (maybeDto.metric && maybeDto.value) {
        const dto: MapSyncDTO<T> = (maybeDto: MapSyncDTO<T>)
        this.set(dto.metric, dto.value)
      } else {
        throw new Error('Unknown MAP_SYNC data: ' + JSON.stringify(data))
      }
    })
  }

  set (metric: T, value: mixed): void {
    const oldValue = this._metrics.get(metric)
    if (JSON.stringify(oldValue) === JSON.stringify(value)) {
      // metric's value was not updated
      return
    }

    this._metrics.set(metric, value)

    if (this._messageBus) {
      const data: MapSyncDTO<T> = {
        metric: metric,
        value: value
      }
      this._messageBus.send(messages.MAP_SYNC, data)
    }
  }

  get (metric: T): any {
    return this._metrics.get(metric)
  }
}

export default MapSync
