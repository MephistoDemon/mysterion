// @flow
import {EventCollector} from './events'
import type {Event} from './events'

class NullCollector implements EventCollector {
  collectEvents (...events: Array<Event>): Promise<void> {
    return Promise.resolve()
  }
}

export default NullCollector
