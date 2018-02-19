import {expect} from 'chai'
import connection from '@/store/modules/connection'
import type from '@/store/types'

describe('mutations', () => {
  describe('CONNECTION_IP', () => {
    const connectionIp = connection.mutations[type.CONNECTION_IP]

    it('updates ip when ip is available', () => {
      const state = { ip: 'old' }
      connectionIp(state, 'new')
      expect(state).to.eql({ip: 'new'})
    })

    it('leaves last ip when ip is unavailable', () => {
      const state = { ip: 'old' }
      connectionIp(state, null)
      expect(state).to.eql({ ip: 'old' })
    })
  })

  describe('CONNECTION_STATUS_ALL', () => {
    const connectionStatusAll = connection.mutations[type.CONNECTION_STATUS_ALL]

    it('updates all statuses', () => {
      const state = {}
      connectionStatusAll(state, {
        status: 'status',
        stats: 'stats',
        ip: 'ip'
      })
      expect(state).to.eql({
        status: 'status',
        stats: 'stats',
        ip: 'ip'
      })
    })

    it('updates all statuses except ip when ip is unavailable', () => {
      const state = {
        ip: 'old ip'
      }
      connectionStatusAll(state, {
        status: 'new status',
        stats: 'new stats',
        ip: null
      })
      expect(state).to.eql({
        status: 'new status',
        stats: 'new stats',
        ip: 'old ip'
      })
    })
  })
})
