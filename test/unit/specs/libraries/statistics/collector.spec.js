import {ElkCollector, newEvent} from '../../../../../src/libraries/statistics/collector'
import MockAdapter from 'axios-mock-adapter'

describe('Elk collector', () => {
  let elk = new ElkCollector('http://mocked.stuff')
  let axiosMock = new MockAdapter(elk._axiosApi)

  it('sends events to elk', async () => {
    let event1 = newEvent('event1', {})
    let event2 = newEvent('event2', {})
    axiosMock.onPost('/').reply(({url, data}) => {
      expect(url).to.be.eql('/')
      expect(JSON.parse(data)).to.be.eql([event1, event2])
      return [200, 'ok']
    })
    await elk.sendEvents(event1, event2)
  })
  it('catches ELK service errors', async () => {
    let event1 = newEvent('event1', {})
    axiosMock.onPost('/').reply(() => [201, 'not ok'])
    try {
      await elk.sendEvents(event1)
    } catch (error) {
      expect(error).to.be.instanceOf(Error).and.to.have.property('message', 'Invalid response from ELK service: 201 : not ok')
    }
  })
})
