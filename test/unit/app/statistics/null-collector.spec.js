import {newEvent} from '../../../../src/app/statistics/events'
import NullCollector from "../../../../src/app/statistics/null-collector"

describe('Null collector', () => {
  let collector = new NullCollector()

  it('sends events', async () => {
    let event1 = newEvent({}, 'event1', 123, {})
    let event2 = newEvent({}, 'event2', 123, {})

    await collector.collectEvents(event1, event2)
  })
})
