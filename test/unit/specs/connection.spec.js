import {expect} from 'chai'

import type from '@/store/types'
// eslint-disable-next-line import/no-webpack-loader-syntax
import connectionInjector from 'inject-loader!@/store/modules/connection'

function FakeTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  const fakeError = new Error('Mock error')

  return {
    getFakeApi: function () {
      return {
        connection: {
          ip: async function () {
            if (ipFail) {
              throw fakeError
            }
            return 'mock ip'
          },
          status: async function () {
            if (statusFail) {
              throw fakeError
            }
            return {
              status: 'mock status'
            }
          },
          statistics: async function () {
            if (statisticsFail) {
              throw fakeError
            }
            return 'mock statistics'
          }
        }
      }
    },
    cleanup: function () {
      this.setStatusFail(false)
      this.setStatisticsFail(false)
      this.setIpFail(false)
    },
    setStatusFail: function (value) {
      statusFail = value
    },
    setStatisticsFail: function (value) {
      statisticsFail = value
    },
    setIpFail: function (value) {
      ipFail = value
    },
    getFakeError: function () {
      return fakeError
    }
  }
}
const fakeTequilapiManipulator = FakeTequilapiManipulator()

const connection = connectionInjector({
  '../../../api/tequilapi': fakeTequilapiManipulator.getFakeApi
}).default

async function executeAction (action) {
  const mutations = []
  const commit = (key, value) => {
    mutations.push({key, value})
  }

  const dispatch = (action) => {
    return connection.actions[action]({commit: commit, dispatch: dispatch})
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
    fakeTequilapiManipulator.cleanup()
  })

  describe('CONNECTION_IP', () => {
    it('commits new ip', async function () {
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.CONNECTION_IP,
        value: 'mock ip'
      }])
    })

    it('commits error when api fails', async function () {
      fakeTequilapiManipulator.setIpFail(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapiManipulator.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATUS', () => {
    it('commits new status', async function () {
      const committed = await executeAction(type.CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.CONNECTION_STATUS,
        value: 'mock status'
      }])
    })

    it('commits error when api fails', async function () {
      fakeTequilapiManipulator.setStatusFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapiManipulator.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATISTICS', () => {
    it('commits new statistics', async function () {
      const committed = await executeAction(type.CONNECTION_STATISTICS)
      expect(committed).to.eql([{
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      }])
    })

    it('commits error when api fails', async function () {
      fakeTequilapiManipulator.setStatisticsFail(true)
      const committed = await executeAction(type.CONNECTION_STATISTICS)
      expect(committed).to.eql([{
        key: type.REQUEST_FAIL,
        value: fakeTequilapiManipulator.getFakeError()
      }])
    })
  })

  describe('CONNECTION_STATUS_ALL', () => {
    it('updates status, statistics and ip', async function () {
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
        }
      ])
    })

    it('returns successful data when status fails', async function () {
      fakeTequilapiManipulator.setStatusFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
        {
          key: type.REQUEST_FAIL,
          value: fakeTequilapiManipulator.getFakeError()
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

    it('returns successful data when statistics fail', async function () {
      fakeTequilapiManipulator.setStatisticsFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
        {
          key: type.CONNECTION_STATUS,
          value: 'mock status'
        },
        {
          key: type.REQUEST_FAIL,
          value: fakeTequilapiManipulator.getFakeError()
        },
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        }
      ])
    })
  })
})
