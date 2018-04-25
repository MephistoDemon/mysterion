// @flow
import {type Event, Collector} from './collector'

class AggregatingCollector implements Collector {
  _events: Array<Event>
  _delegate: Collector
  _accumulatorSize: number
  _flushTimeout: number
  _timeoutHandle: TimeoutID

  constructor (delegate: Collector, accumulatorSize: number, flushTimeout: number = 10) {
    this._events = []
    this._delegate = delegate
    this._accumulatorSize = accumulatorSize
    this._flushTimeout = flushTimeout
  }

  async sendEvents (...events: Array<Event>): Promise<any> {
    clearTimeout(this._timeoutHandle)
    this._events.push(...events)
    if (this._events.length < this._accumulatorSize) {
      this._setupFlushAfterTime()
      return Promise.resolve()
    }
    await this._sendEventsToDelegate()
  }

  _setupFlushAfterTime (): void {
    this._timeoutHandle = setTimeout(() => this._sendEventsToDelegate(), this._flushTimeout * 1000)
  }

  async _sendEventsToDelegate (): Promise<any> {
    let eventsToSend = this._events.splice(0, this._accumulatorSize)
    return this._delegate.sendEvents(...eventsToSend)
  }
}

export {AggregatingCollector}
