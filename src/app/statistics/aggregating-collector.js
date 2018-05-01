// @flow
import {EventCollector} from './events'
import type {Event} from './events'

class AggregatingCollector implements EventCollector {
  _events: Array<Event>
  _delegate: EventCollector
  _accumulatorSize: number
  _flushTimeout: number
  _timeoutHandle: TimeoutID

  constructor (delegate: EventCollector, accumulatorSize: number, flushTimeoutInSeconds: number = 10) {
    this._events = []
    this._delegate = delegate
    this._accumulatorSize = accumulatorSize
    this._flushTimeout = flushTimeoutInSeconds
  }

  async collectEvents (...events: Array<Event>): Promise<void> {
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
    return this._delegate.collectEvents(...eventsToSend)
  }
}

export default AggregatingCollector
