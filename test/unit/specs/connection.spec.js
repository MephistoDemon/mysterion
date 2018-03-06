import {expect} from 'chai'

import type from '@/store/types'
// eslint-disable-next-line import/no-webpack-loader-syntax
import connectionInjector from 'inject-loader!@/store/modules/connection'
import utils from '../utils'

const fakeTequilapi = utils.fakeTequilapiManipulator()

const connection = connectionInjector({
  '../../../libraries/tequilapi': fakeTequilapi.getFakeApi
}).default

async function executeAction (action, state = {}) {
  const mutations = []
  const commit = (key, value) => {
    mutations.push({key, value})
  }

  const dispatch = (action) => {
    const context = {commit, dispatch, state}
    return connection.actions[action](context)
  }

  await dispatch(action)
  return mutations
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
    const connectionStatistics = connection.mutations[type.CONNECTION_STATISTICS]

    it('updates statistics', () => {
      const state = {}
      connectionStatistics(state, {some_stat: 'some value'})
      expect(state).to.eql({ statistics: {some_stat: 'some value'} })
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

  describe('CONNECTION_STATISTICS_RESET', () => {
    it('resets statistics', () => {
      let store = {}
      connection.mutations[type.CONNECTION_STATISTICS_RESET](store)
      expect(store.statistics).to.eql({})
    })
  })

  describe('INCREASE_IP_TIMEOUT_COUNTER', () => {
    it('increases ip timeout counter', () => {
      let store = {
        ipTimeoutsCount: 0
      }
      connection.mutations[type.INCREASE_IP_TIMEOUT_COUNTER](store)
      expect(store.ipTimeoutsCount).to.eql(1)
      connection.mutations[type.INCREASE_IP_TIMEOUT_COUNTER](store)
      expect(store.ipTimeoutsCount).to.eql(2)
    })
  })

  describe('RESET_TIMEOUT_COUNTER', () => {
    it('resets ip timeout counter', () => {
      let store = {
        ipTimeoutsCount: 2
      }
      connection.mutations[type.RESET_TIMEOUT_COUNTER](store)
      expect(store.ipTimeoutsCount).to.eql(0)
    })
  })
})

describe('actions', () => {
  beforeEach(() => {
    fakeTequilapi.cleanup()
  })

  describe('CONNECTION_IP', () => {
    it('commits new ip and resets timeout counter', async () => {
      const state = { ipTimeoutsCount: 2 }
      const committed = await executeAction(type.CONNECTION_IP, state)
      expect(committed).to.eql([
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        },
        {
          key: type.RESET_TIMEOUT_COUNTER,
          value: undefined
        }
      ])
    })

    it('ignores error and increases timeout counter when api timeouts for the first time', async () => {
      fakeTequilapi.setIpTimeout(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.INCREASE_IP_TIMEOUT_COUNTER,
        value: undefined
      }])
    })

    it('commits error and increases timeout counter when api timeouts for the third time', async () => {
      fakeTequilapi.setIpTimeout(true)
      const state = { ipTimeoutsCount: 2 }
      const committed = await executeAction(type.CONNECTION_IP, state)
      expect(committed).to.eql([
        {
          key: type.REQUEST_FAIL,
          value: fakeTequilapi.getFakeTimeoutError()
        },
        {
          key: type.INCREASE_IP_TIMEOUT_COUNTER,
          value: undefined
        }
      ])
    })

    it('commits error when api returns unknown error', async () => {
      fakeTequilapi.setIpFail(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapi.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATUS', () => {
    it('commits new status', async () => {
      const committed = await executeAction(type.CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.CONNECTION_STATUS,
        value: 'mock status'
      }])
    })

    it('commits error when api fails', async () => {
      fakeTequilapi.setStatusFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapi.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATISTICS', () => {
    it('commits new statistics', async () => {
      const committed = await executeAction(type.CONNECTION_STATISTICS)
      expect(committed).to.eql([{
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      }])
    })

    it('commits error when api fails', async () => {
      fakeTequilapi.setStatisticsFail(true)
      const committed = await executeAction(type.CONNECTION_STATISTICS)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapi.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATUS_ALL', () => {
    it('updates status, statistics and ip', async () => {
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
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
        },
        {
          key: type.RESET_TIMEOUT_COUNTER,
          value: undefined
        }
      ])
    })

    it('returns successful data when status fails', async () => {
      fakeTequilapi.setStatusFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
        {
          key: type.REQUEST_FAIL,
          value: fakeTequilapi.getFakeError()
        },
        {
          key: type.CONNECTION_STATISTICS,
          value: 'mock statistics'
        },
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        },
        {
          key: type.RESET_TIMEOUT_COUNTER,
          value: undefined
        }
      ])
    })

    it('returns successful data when statistics fail', async () => {
      fakeTequilapi.setStatisticsFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
        {
          key: type.CONNECTION_STATUS,
          value: 'mock status'
        },
        {
          key: type.REQUEST_FAIL,
          value: fakeTequilapi.getFakeError()
        },
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        },
        {
          key: type.RESET_TIMEOUT_COUNTER,
          value: undefined
        }
      ])
    })
  })
})
