// @flow
import {describe, it, expect} from '../../../helpers/dependencies'
import lolex from 'lolex'
import ProposalFetcher from '../../../../src/app/data-fetchers/proposal-fetcher'
import {nextTick} from '../../../helpers/utils'
import ProposalDTO from '../../../../src/libraries/api/client/dto/proposal'

describe('DataFetchers', () => {
  describe('ProposalFetcher', () => {
    let clock
    let interval = 1001

    before(() => {
      clock = lolex.install()
    })

    after(() => {
      clock.uninstall()
    })

    async function tickWithDelay (duration) {
      clock.tick(duration)
      await nextTick()
    }

    function mockTequilapi (proposals: Array<ProposalDTO>) {
      return {
        findProposals: () => Promise.resolve(proposals)
      }
    }

    const tequilapi = mockTequilapi([
      {id: '0x1'},
      {id: '0x2'}
    ])

    let fetcher

    beforeEach(() => {
      fetcher = new ProposalFetcher(tequilapi, interval)
    })

    describe('.run', () => {
      it('triggers subscriber callbacks', async () => {
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.start()

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await tickWithDelay(1000)
        expect(counter).to.equal(2)
      })

      it('triggers subscriber callbacks with proposals', async () => {
        let proposals = []

        fetcher.subscribe((fetchedProposals) => {
          proposals = fetchedProposals
        })

        fetcher.start(1001)

        await tickWithDelay(1000)

        expect(proposals.length).to.equal(2)
        expect(proposals[0]).to.deep.equal({id: '0x1'})
        expect(proposals[1]).to.deep.equal({id: '0x2'})
      })

      it('stops', async () => {
        let counter = 0

        fetcher.subscribe(() => counter++)
        fetcher.start()

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await fetcher.stop()

        await tickWithDelay(1000)

        expect(counter).to.equal(1)
      })
    })

    describe('.fetch', () => {
      it('returns proposals', async () => {
        const proposals = await fetcher.fetch()

        expect(proposals.length).to.equal(2)
        expect(proposals[0]).to.deep.equal({id: '0x1'})
        expect(proposals[1]).to.deep.equal({id: '0x2'})
      })
    })
  })
})
