import {expect} from 'chai'

import type from '@/store/types'
// eslint-disable-next-line import/no-webpack-loader-syntax
import connectionInjector from 'inject-loader!@/store/modules/connection'
const connection = connectionInjector({
  '../../../api/tequilapi': function () {
    return FakeTequilapi()
  }
}).default

function FakeTequilapi () {
  return {
    connection: {
      ip: async function () {
        return 'mock ip'
      },
      status: async function () {
        return {
          status: 'mock status'
        }
      },
      statistics: async function () {
        return 'mock statistics'
      }
    }
  }
}

describe('mutations', () => {
  describe('CONNECTION_STATUS', () => {
    const connectionStatus = connection.mutations[type.CONNECTION_STATUS]

    it('updates status', () => {
      const state = {}
      connectionStatus(state, 'TESTING')
      expect(state).to.eql({ status: 'TESTING' })
    })
  })

  describe('CONNECTION_STATISTICS', () => {
    const connectionStats = connection.mutations[type.CONNECTION_STATISTICS]

    it('updates stats', () => {
      const state = {}
      connectionStats(state, {some_stat: 'some value'})
      expect(state).to.eql({ stats: {some_stat: 'some value'} })
    })
  })

  describe('CONNECTION_IP', () => {
    const connectionIp = connection.mutations[type.CONNECTION_IP]

    it('updates ip', () => {
      const state = { ip: 'old' }
      connectionIp(state, 'new')
      expect(state).to.eql({ip: 'new'})
    })
  })

  describe('CONNECTION_STATS_RESET', () => {
    it('resets stats', () => {
      let store = {}
      connection.mutations[type.CONNECTION_STATS_RESET](store)
      expect(store.stats).to.eql({})
    })
  })
})

describe('actions', () => {
  beforeEach(function () {
    this.commited = []
    this.commit = (key, value) => {
      this.commited.push({key, value})
    }

    this.dispatch = (action) => {
      return connection.actions[action]({commit: this.commit, dispatch: this.dispatch})
    }
  })

  describe('CONNECTION_IP', () => {
    it('commits new ip', async function () {
      await this.dispatch(type.CONNECTION_IP)
      expect(this.commited).to.eql([{
        key: type.CONNECTION_IP,
        value: 'mock ip'
      }])
    })
  })

  describe('CONNECTION_STATUS', () => {
    it('commits new status', async function () {
      await this.dispatch(type.CONNECTION_STATUS)
      expect(this.commited).to.eql([{
        key: type.CONNECTION_STATUS,
        value: 'mock status'
      }])
    })
  })

  describe('CONNECTION_STATISTICS', () => {
    it('commits new statistics', async function () {
      await this.dispatch(type.CONNECTION_STATISTICS)
      expect(this.commited).to.eql([{
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      }])
    })
  })

  describe('CONNECTION_STATUS_ALL', () => {
    it('updates status, statistics and ip', async function () {
      await this.dispatch(type.CONNECTION_STATUS_ALL)
      expect(this.commited).to.have.deep.members([
        {
          key: type.CONNECTION_STATUS,
          value: 'mock status'
        },
        {
          key: type.CONNECTION_STATISTICS,
          value: 'mock statistics'
        },
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        }
      ])
    })
  })
})
