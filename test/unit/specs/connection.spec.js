import {expect} from 'chai'
import connection from '@/store/modules/connection'
import type from '@/store/types'

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
