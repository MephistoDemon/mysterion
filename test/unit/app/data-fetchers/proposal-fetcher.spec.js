/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import {describe, it, expect, before, beforeEach, after} from '../../../helpers/dependencies'
import lolex from 'lolex'
import ProposalFetcher from '../../../../src/app/data-fetchers/proposal-fetcher'
import ProposalDTO from '../../../../src/libraries/mysterium-tequilapi/dto/proposal'
import {nextTick} from '../../../helpers/utils'
import EmptyTequilapiClientMock from '../../renderer/store/modules/empty-tequilapi-client-mock'
import logger from '../../../../src/app/logger'

class IdentityTequilapiClientMock extends EmptyTequilapiClientMock {
  mockError: Error = new Error('Mock error')
  _proposals: Array<ProposalDTO>
  _willFail: boolean = false

  constructor (proposals: Array<ProposalDTO>) {
    super()
    this._proposals = proposals
  }

  async findProposals (_filter): Promise<Array<ProposalDTO>> {
    if (this._willFail) {
      throw this.mockError
    }
    return this._proposals
  }

  markToFail () {
    this._willFail = true
  }

  markToSucceed () {
    this._willFail = false
  }
}

describe('DataFetchers', () => {
  describe('ProposalFetcher', () => {
    let clock
    const interval = 1001
    const tequilapi = new IdentityTequilapiClientMock([
      new ProposalDTO({id: '0x1'}),
      new ProposalDTO({id: '0x2'})
    ])
    let fetcher

    before(() => {
      clock = lolex.install()
    })

    after(() => {
      clock.uninstall()
    })

    beforeEach(() => {
      fetcher = new ProposalFetcher(tequilapi, interval)
    })

    async function tickWithDelay (duration) {
      clock.tick(duration)
      await nextTick()
    }

    describe('.start', () => {
      it('triggers subscriber callbacks', async () => {
        let counter = 0

        fetcher.onFetchedProposals(() => counter++)
        fetcher.start()

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await tickWithDelay(1000)
        expect(counter).to.equal(2)
      })

      it('triggers subscriber callbacks with proposals', async () => {
        let proposals = []

        fetcher.onFetchedProposals((fetchedProposals) => {
          proposals = fetchedProposals
        })

        fetcher.start()

        await tickWithDelay(1000)

        expect(proposals.length).to.equal(2)
        expect(proposals[0]).to.deep.equal(new ProposalDTO({id: '0x1'}))
        expect(proposals[1]).to.deep.equal(new ProposalDTO({id: '0x2'}))
      })

      describe('when proposal fetching fails', () => {
        before(() => {
          tequilapi.markToFail()
        })

        after(() => {
          tequilapi.markToSucceed()
        })

        it('triggers failure callbacks with error', async () => {
          let error = null
          fetcher.onFetchingError((err) => {
            logger.info('ERROR!', err)
            error = err
          })

          fetcher.start()

          await tickWithDelay(1001)
          expect(error).to.eql(tequilapi.mockError)
        })
      })
    })

    describe('.stop', () => {
      it('stops fetching of proposals', async () => {
        let counter = 0

        fetcher.onFetchedProposals(() => counter++)
        fetcher.start()

        await tickWithDelay(1000)
        expect(counter).to.equal(1)

        await fetcher.stop()

        await tickWithDelay(1000)

        expect(counter).to.equal(1)
      })

      it('does not fail when invoked without starting', async () => {
        await fetcher.stop()
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
