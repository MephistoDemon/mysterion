import {expect} from 'chai'

import type from '@/store/types'
import {mutations, actionsFactory} from '@/store/modules/connection'
import utils from '../../../../helpers/utils'
import { FunctionLooper } from '@/../libraries/functionLooper'
import connectionStatus from '@/../libraries/api/connectionStatus'
import communication from '@/../app/communication'
import RendererCommunication from '@/../app/communication/renderer-communication'
import FakeMessageBus from '../../../../helpers/fakeMessageBus'

const fakeTequilapi = utils.fakeTequilapiManipulator()

const fakeMessageBus = new FakeMessageBus()
const rendererCommunication = new RendererCommunication(fakeMessageBus)

async function executeAction (action, state = {}, payload = {}) {
  const mutations = []
  const commit = (key, value) => {
    mutations.push({key, value})
  }

  const dispatch = (action, payload = {}) => {
    const context = {commit, dispatch, state}
    const actions = actionsFactory(fakeTequilapi.getFakeApi(), rendererCommunication)

    return actions[action](context, payload)
  }

  await dispatch(action, payload)
  return mutations
}

describe('mutations', () => {
  describe('SET_CONNECTION_STATUS', () => {
    const connectionStatus = mutations[type.SET_CONNECTION_STATUS]

    it('updates remote status', () => {
      const state = {}
      connectionStatus(state, 'TESTING')
      expect(state).to.eql({ status: 'TESTING' })
    })
  })

  describe('CONNECTION_STATISTICS', () => {
    const connectionStatistics = mutations[type.CONNECTION_STATISTICS]

    it('updates statistics', () => {
      const state = {}
      connectionStatistics(state, {some_stat: 'some value'})
      expect(state).to.eql({ statistics: {some_stat: 'some value'} })
    })
  })

  describe('CONNECTION_IP', () => {
    const connectionIp = mutations[type.CONNECTION_IP]

    it('updates ip', () => {
      const state = { ip: 'old' }
      connectionIp(state, 'new')
      expect(state).to.eql({ip: 'new'})
    })
  })

  describe('CONNECTION_STATISTICS_RESET', () => {
    it('resets statistics', () => {
      let state = {}
      mutations[type.CONNECTION_STATISTICS_RESET](state)
      expect(state.statistics).to.eql({})
    })
  })

  describe('SET_ACTION_LOOPER', () => {
    it('sets action loopers', () => {
      const state = {
        actionLoopers: {}
      }
      const actionLooper1 = {
        action: type.CONNECTION_IP,
        looper: new FunctionLooper()
      }
      mutations[type.SET_ACTION_LOOPER](state, actionLooper1)
      expect(state.actionLoopers).to.eql({
        [actionLooper1.action]: actionLooper1.looper
      })

      const actionLooper2 = {
        action: type.FETCH_CONNECTION_STATUS,
        looper: new FunctionLooper()
      }
      mutations[type.SET_ACTION_LOOPER](state, actionLooper2)
      expect(state.actionLoopers).to.eql({
        [actionLooper1.action]: actionLooper1.looper,
        [actionLooper2.action]: actionLooper2.looper
      })
    })
  })

  describe('REMOVE_ACTION_LOOPER', () => {
    it('removes single action looper', () => {
      const noop = () => {}
      const ipLooper = new FunctionLooper(noop, 1000)
      const statusLooper = new FunctionLooper(noop, 1000)
      const state = {
        actionLoopers: {
          [type.CONNECTION_IP]: ipLooper,
          [type.FETCH_CONNECTION_STATUS]: statusLooper
        }
      }
      mutations[type.REMOVE_ACTION_LOOPER](state, type.CONNECTION_IP)
      expect(state.actionLoopers).to.eql({
        [type.FETCH_CONNECTION_STATUS]: statusLooper
      })
    })
  })
})

describe('actions', () => {
  beforeEach(() => {
    fakeTequilapi.cleanup()
  })

  describe('START_ACTION_LOOPING', () => {
    it('sets update looper and performs first looper cycle', async () => {
      const state = {
        actionLoopers: {}
      }
      const committed = await executeAction(type.START_ACTION_LOOPING, state, {
        action: type.CONNECTION_STATISTICS,
        threshold: 1000
      })

      expect(committed.length).to.eql(2)

      expect(committed[0].key).to.eql(type.SET_ACTION_LOOPER)
      const {action, looper} = committed[0].value
      expect(action).to.eql(type.CONNECTION_STATISTICS)
      expect(looper).to.be.an.instanceof(FunctionLooper)
      expect(looper.isRunning()).to.eql(true)

      expect(committed[1]).to.eql({
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      })
    })

    it('does not start second looper if it already exists', async () => {
      const noop = () => {}
      const looper = new FunctionLooper(noop, 1000)
      const state = {
        actionLoopers: {
          [type.CONNECTION_STATISTICS]: looper
        }
      }
      const committed = await executeAction(type.START_ACTION_LOOPING, state, {
        action: type.CONNECTION_STATISTICS,
        threshold: 1000
      })

      expect(committed).to.eql([])
    })
  })

  describe('STOP_ACTION_LOOPING', () => {
    it('stops and cleans update looper', async () => {
      const actionLooper = new FunctionLooper(() => {}, 0)
      actionLooper.start()
      const state = {
        actionLoopers: {
          [type.CONNECTION_IP]: actionLooper
        }
      }

      expect(actionLooper.isRunning()).to.eql(true)
      const committed = await executeAction(type.STOP_ACTION_LOOPING, state, type.CONNECTION_IP)
      expect(committed).to.eql([{
        key: type.REMOVE_ACTION_LOOPER,
        value: type.CONNECTION_IP
      }])
      expect(actionLooper.isRunning()).to.eql(false)
    })

    it('does not throw error with no update looper', async () => {
      const state = {
        actionLoopers: {}
      }
      await executeAction(type.STOP_ACTION_LOOPING, state, type.CONNECTION_IP)
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

    it('ignores errors', async () => {
      fakeTequilapi.setIpTimeout(true)
      const committed = await executeAction(type.CONNECTION_IP)
      expect(committed).to.eql([])
    })
  })

  describe('FETCH_CONNECTION_STATUS', () => {
    it('commits new status', async () => {
      const committed = await executeAction(type.FETCH_CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.SET_CONNECTION_STATUS,
        value: 'mock status'
      }])
    })

    it('commits error when api fails', async () => {
      fakeTequilapi.setStatusFail(true)
      const committed = await executeAction(type.FETCH_CONNECTION_STATUS)
      expect(committed).to.eql([{
        key: type.SHOW_ERROR,
        value: fakeTequilapi.getFakeError()
      }])
    })
  })

  describe('SET_CONNECTION_STATUS', () => {
    beforeEach(() => {
      fakeMessageBus.clean()
    })

    it('commits new status', async () => {
      const committed = await executeAction(type.SET_CONNECTION_STATUS, {}, connectionStatus.CONNECTING)
      expect(committed).to.eql([{
        key: type.SET_CONNECTION_STATUS,
        value: connectionStatus.CONNECTING
      }])
    })

    it('sends new status to IPC', async () => {
      const state = {
        status: connectionStatus.NOT_CONNECTED
      }
      await executeAction(type.SET_CONNECTION_STATUS, state, connectionStatus.CONNECTING)
      expect(fakeMessageBus.lastChannel).to.eql(communication.CONNECTION_STATUS_CHANGED)
      expect(fakeMessageBus.lastData).to.eql({
        oldStatus: connectionStatus.NOT_CONNECTED,
        newStatus: connectionStatus.CONNECTING
      })
    })

    it('does not send new status to IPC when status does not change', async () => {
      const state = {
        status: connectionStatus.NOT_CONNECTED
      }
      await executeAction(type.SET_CONNECTION_STATUS, state, connectionStatus.NOT_CONNECTED)
      expect(fakeMessageBus.lastChannel).to.eql(null)
    })

    it('starts looping statistics when changing state to connected', async () => {
      const state = {
        actionLoopers: {}
      }
      const committed = await executeAction(type.SET_CONNECTION_STATUS, state, connectionStatus.CONNECTED)
      expect(committed.length).to.eql(3)
      expect(committed[0]).to.eql({
        key: type.SET_CONNECTION_STATUS,
        value: connectionStatus.CONNECTED
      })
      expect(committed[1].key).to.eql(type.SET_ACTION_LOOPER)
      expect(committed[1].value.action).to.eql(type.CONNECTION_STATISTICS)
      const looper = committed[1].value.looper
      expect(looper).to.be.an.instanceof(FunctionLooper)
      expect(looper.isRunning()).to.eql(true)
      expect(committed[2]).to.eql({
        key: type.CONNECTION_STATISTICS,
        value: 'mock statistics'
      })
    })

    it('stops looping statistics when changing state from connected', async () => {
      const noop = () => {}
      const looper = new FunctionLooper(noop, 1000)
      looper.start()
      const state = {
        status: connectionStatus.CONNECTED,
        actionLoopers: {
          [type.CONNECTION_STATISTICS]: looper
        }
      }
      const committed = await executeAction(type.SET_CONNECTION_STATUS, state, connectionStatus.DISCONNECTING)

      expect(committed).to.eql([
        {
          key: type.SET_CONNECTION_STATUS,
          value: connectionStatus.DISCONNECTING
        },
        {
          key: type.REMOVE_ACTION_LOOPER,
          value: type.CONNECTION_STATISTICS
        }
      ])
      expect(looper.isRunning()).to.eql(false)
    })

    it('does nothing when changing state from connected to connected', async () => {
      const noop = () => {}
      const looper = new FunctionLooper(noop, 1000)
      const state = {
        status: connectionStatus.CONNECTED,
        actionLoopers: {
          [type.CONNECTION_STATISTICS]: looper
        }
      }

      const committed = await executeAction(type.SET_CONNECTION_STATUS, state, connectionStatus.CONNECTED)
      expect(committed).to.eql([])
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

  describe('CONNECT', () => {
    it('marks connecting status, resets statistics, hides error', async () => {
      const state = {
        actionLoopers: {}
      }
      const committed = await executeAction(type.CONNECT, state)
      expect(committed).to.eql([
        {
          key: type.SET_CONNECTION_STATUS,
          value: connectionStatus.CONNECTING
        },
        {
          key: type.CONNECTION_STATISTICS_RESET,
          value: undefined
        },
        {
          key: type.HIDE_ERROR,
          value: undefined
        }
      ])
    })

    describe('when connection fails', () => {
      beforeEach(() => {
        fakeTequilapi.setConnectFail(true)
      })

      it('throws error', async () => {
        fakeTequilapi.setConnectFail(true)
        const state = {
          actionLoopers: {}
        }
        const f = async () => { await executeAction(type.CONNECT, state) }
        const error = await utils.captureAsyncError(f)
        expect(error).to.be.an('error')
        expect(error.message).to.eql('Connection to node failed.')
      })
    })

    describe('when connection was cancelled', () => {
      beforeEach(() => {
        fakeTequilapi.setConnectFailClosedRequest(true)
      })

      it('does not throw error and does not show error', async () => {
        const state = {
          actionLoopers: {}
        }
        const committed = await executeAction(type.CONNECT, state)
        committed.forEach((action) => {
          expect(action.key).not.to.eql('SHOW_ERROR_MESSAGE')
        })
      })
    })
  })

  describe('DISCONNECT', () => {
    it('marks disconnecting status', async () => {
      const state = {
        actionLoopers: {}
      }
      const committed = await executeAction(type.DISCONNECT, state)
      expect(committed[0]).to.eql({
        key: type.SET_CONNECTION_STATUS,
        value: connectionStatus.DISCONNECTING
      })
    })
  })
})
