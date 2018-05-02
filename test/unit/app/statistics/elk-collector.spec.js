import ElkCollector from '../../../../src/app/statistics/elk-collector'
import MockAdapter from 'axios-mock-adapter'
import {capturePromiseError} from '../../../helpers/utils'
import {newEvent} from '../../../../src/app/statistics/events'

describe('Elk collector', () => {
  let elk = new ElkCollector('http://mocked.stuff')
  let axiosMock = new MockAdapter(elk._axiosApi)

  it('sends events to elk', async () => {
    let event1 = newEvent({}, 'event1', 123, {})
    let event2 = newEvent({}, 'event2', 123, {})
    axiosMock.onPost('/').reply(({url, data}) => {
      expect(url).to.be.eql('/')
      expect(JSON.parse(data)).to.be.eql([event1, event2])
      return [200, 'ok']
    })

    await elk.collectEvents(event1, event2)
  })
  it('catches ELK service errors', async () => {
    let event1 = newEvent({}, 'event1', 123, {})
    axiosMock.onPost('/').reply(() => [201, 'not ok'])

    const error = await capturePromiseError(elk.collectEvents(event1))
    expect(error).to.be.instanceOf(Error).and.to.have.property('message', 'Invalid response from ELK service: 201 : not ok')
  })
})
