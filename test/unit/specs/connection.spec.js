import {expect} from 'chai'

import type from '@/store/types'
// eslint-disable-next-line import/no-webpack-loader-syntax
import connectionInjector from 'inject-loader!@/store/modules/connection'
import utils from '../utils'
import { FunctionLooper } from '@/../app/utils'

const fakeTequilapi = utils.fakeTequilapiManipulator()

const connection = connectionInjector({
  '../../../libraries/api/tequilapi': fakeTequilapi.getFakeApi
}).default

async function executeAction (action, state = {}) {
  const mutations = []
  const commit = (key, value) => {
    mutations.push({key, value})
  }

  const dispatch = (action, payload = {}) => {
    const context = {commit, dispatch, state}
    return connection.actions[action](context, payload)
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
      let state = {}
      connection.mutations[type.CONNECTION_STATISTICS_RESET](state)
      expect(state.statistics).to.eql({})
    })
  })

  describe('SET_UPDATE_LOOPER', () => {
    it('sets update looper', () => {
      const state = {}
      const looper = new FunctionLooper()
      connection.mutations[type.SET_UPDATE_LOOPER](state, looper)
      expect(state.updateLooper).to.eql(looper)
    })
  })
})

describe('actions', () => {
  beforeEach(() => {
    fakeTequilapi.cleanup()
  })

  describe('START_UPDATER', () => {
    it('updates all statuses and sets updater looper', async () => {
      const committed = await executeAction(type.START_UPDATER)
      expect(committed.length).to.eql(3)
      expect(committed[0]).to.eql({
        key: type.CONNECTION_STATUS,
        value: 'mock status'
      })
      expect(committed[1]).to.eql({
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      })
      expect(committed[2].key).to.eql(type.SET_UPDATE_LOOPER)
      expect(committed[2].value).to.an.instanceof(FunctionLooper)
    })
  })

  describe('STOP_UPDATER', () => {
    it('stops and cleans update looper', async () => {
      const updater = () => {}
      const updateLooper = new FunctionLooper(updater, 1000)
      updateLooper.start()
      const state = { updateLooper }

      expect(updateLooper.isRunning()).to.eql(true)
      const committed = await executeAction(type.STOP_UPDATER, state)
      expect(committed).to.eql([{
        key: type.SET_UPDATE_LOOPER,
        value: null
      }])
      expect(updateLooper.isRunning()).to.eql(false)
    })

    it('does not throw error with no update looper', async () => {
      await executeAction(type.STOP_UPDATER)
    })
  })

  describe('CONNECTION_IP', () => {
    it('commits new ip counter', async () => {
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([
        {
          key: type.CONNECTION_IP,
          value: 'mock ip'
        }
      ])
    })

    it('ignores error when api timeouts', async () => {
      fakeTequilapi.setIpTimeout(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([])
    })

    it('commits error when api returns unknown error', async () => {
      fakeTequilapi.setIpFail(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.SHOW_ERROR,
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
        key: type.SHOW_ERROR,
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
        key: type.SHOW_ERROR,
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
        }
      ])
    })

    it('returns successful data when status fails', async () => {
      fakeTequilapi.setStatusFail(true)
      const committed = await executeAction(type.CONNECTION_STATUS_ALL)
      expect(committed).to.have.deep.members([
        {
          key: type.SHOW_ERROR,
          value: fakeTequilapi.getFakeError()
        },
        {
          key: type.CONNECTION_STATISTICS,
          value: 'mock statistics'
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
          key: type.SHOW_ERROR,
          value: fakeTequilapi.getFakeError()
        }
      ])
    })
  })
})
