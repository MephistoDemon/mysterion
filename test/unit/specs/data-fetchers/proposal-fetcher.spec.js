/* eslint no-unused-expressions: 0 */
import {describe, it, expect} from '../../../helpers/dependencies'
import lolex from 'lolex'
import ProposalFetcher from '../../../../src/app/data-fetchers/proposal-fetcher'
import FakeAdapter from '../../../../src/libraries/api/client/adapters/fake-adapter'
import TequilApi from '../../../../src/libraries/api/client/tequil-api'
import utils from '../../../helpers/utils'

describe('DataFetchers', () => {
  describe('ProposalFetcher', () => {
    let clock

    before(() => {
      clock = lolex.install()
    })

    after(() => {
      clock.uninstall()
    })

    async function tickWithDelay (duration) {
      clock.tick(duration)
      await utils.nextTick()
    }

    const adapter = new FakeAdapter()
    adapter.setProposalsResponse({
      proposals: [{
        id: '0x1'
      }, {
        id: '0x2'
      }]
    })

    describe('.run', () => {
      it('triggers subscriber callbacks', async () => {
        const fetcher = new ProposalFetcher(new TequilApi(adapter))
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.run(1001)

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await tickWithDelay(1000)
        expect(counter).to.equal(2)
      })

      it('triggers subscriber callbacks with proposals', async () => {
        const fetcher = new ProposalFetcher(new TequilApi(adapter))
        let proposals = []

        fetcher.subscribe((fetchedProposals) => {
          proposals = fetchedProposals
        })

        fetcher.run(1001)

        await tickWithDelay(1000)

        expect(proposals[0]).to.deep.equal({id: '0x1'})
        expect(proposals[1]).to.deep.equal({id: '0x2'})
        expect(proposals.length).to.equal(2)
      })

      it('stops', async () => {
        const fetcher = new ProposalFetcher(new TequilApi(adapter))
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.run(1001)

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        fetcher.stop()

        await tickWithDelay(1000)

        expect(counter).to.equal(1)
      })
    })
  })
})
