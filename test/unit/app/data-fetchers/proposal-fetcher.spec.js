// @flow
import {describe, it, expect, before, beforeEach, after} from '../../../helpers/dependencies'
import lolex from 'lolex'
import ProposalFetcher from '../../../../src/app/data-fetchers/proposal-fetcher'
import ProposalDTO from '../../../../src/libraries/mysterium-tequilapi/dto/proposal'
import {nextTick} from '../../../helpers/utils'

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

    function mockTequilapiClient (proposals: Array<ProposalDTO>) {
      return {
        findProposals: () => Promise.resolve(proposals)
      }
    }

    const tequilapi = mockTequilapiClient([
      new ProposalDTO({id: '0x1'}),
      new ProposalDTO({id: '0x2'})
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
        expect(proposals[0]).to.deep.equal(new ProposalDTO({id: '0x1'}))
        expect(proposals[1]).to.deep.equal(new ProposalDTO({id: '0x2'}))
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
        expect(proposals[0]).to.deep.equal(new ProposalDTO({id: '0x1'}))
        expect(proposals[1]).to.deep.equal(new ProposalDTO({id: '0x2'}))
      })
    })
  })
})
