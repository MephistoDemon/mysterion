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

  describe('CONNECTION_STATS', () => {
    const connectionStats = connection.mutations[type.CONNECTION_STATS]

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
})

describe('actions', () => {
  beforeEach(function () {
    this.commited = {}

    const world = this;
    this.commit = function (key, value) {
      world.commited = {key, value}
    }
  })

  describe('CONNECTION_IP', () => {
    const connectionIp = connection.actions[type.CONNECTION_IP]

    it('commits new ip', async function () {
      await connectionIp({commit: this.commit})
      expect(this.commited.key).to.eql(type.CONNECTION_IP)
      expect(this.commited.value).to.eql('mock ip')
    })
  })

  describe('CONNECTION_STATUS', () => {
    const connectionStatus = connection.actions[type.CONNECTION_STATUS]

    it('commits new status', async function () {
      await connectionStatus({commit: this.commit})
      expect(this.commited.key).to.eql(type.CONNECTION_STATUS)
      expect(this.commited.value).to.eql('mock status')
    })
  })
})
