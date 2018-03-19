import type from '../types'
import tequilAPI from '../../../libraries/api/tequilapi'
import {isTimeoutError} from '../../../libraries/api/errors'
import messages from '../../../app/messages'
import bugReporter from '../../../main/bug-reporting'
import {FunctionLooper} from '../../../libraries/functionLooper'
import connectionStatus from '../../../libraries/api/connectionStatus'
const tequilapi = tequilAPI()

const defaultStatistics = {
}

const state = {
  ip: null,
  // TODO: rename to make clear that this status is internal
  status: connectionStatus.NOT_CONNECTED,
  visibleStatus: null,
  statistics: defaultStatistics,
  actionLoopers: {}
}

const getters = {
  connection: state => state,
  ip: state => state.ip,
  // TODO: test this?
  visibleStatus: state => {
    if (state.visibleStatus) {
      return state.visibleStatus
    }
    return state.status
  }
}

const mutations = {
  [type.SET_CONNECTION_STATUS] (state, status) {
    state.status = status
  },
  [type.CONNECTION_STATISTICS] (state, statistics) {
    state.statistics = statistics
  },
  [type.CONNECTION_IP] (state, ip) {
    state.ip = ip
  },
  [type.CONNECTION_STATISTICS_RESET] (state) {
    state.statistics = defaultStatistics
  },
  [type.SET_ACTION_LOOPER] (state, {action, looper}) {
    state.actionLoopers[action] = looper
  },
  [type.REMOVE_ACTION_LOOPER] (state, action) {
    delete state.actionLoopers[action]
  },
  [type.SET_VISIBLE_STATUS] (state, value) {
    state.visibleStatus = value
  }
}

const actions = {
  async [type.CONNECTION_IP] ({commit}) {
    try {
      const ip = await tequilapi.connection.ip()
      commit(type.CONNECTION_IP, ip)
    } catch (err) {
      if (isTimeoutError(err)) {
        return
      }
      commit(type.SHOW_ERROR, err)
      bugReporter.renderer.captureException(err)
    }
  },
  async [type.START_ACTION_LOOPING] ({dispatch, commit, state}, {action, threshold}) {
    const currentLooper = state.actionLoopers[action]
    if (currentLooper) {
      console.log('Warning: requested to start looping action which is already looping: ' + action)
      return currentLooper
    }

    const func = () => dispatch(action)
    const looper = new FunctionLooper(func, threshold)
    looper.start()
    commit(type.SET_ACTION_LOOPER, {action, looper})
    return looper
  },
  [type.STOP_ACTION_LOOPING] ({commit, state}, action) {
    const looper = state.actionLoopers[action]
    if (looper) {
      looper.stop()
    }
    commit(type.REMOVE_ACTION_LOOPER, action)
  },
  async [type.FETCH_CONNECTION_STATUS] ({commit, dispatch}) {
    try {
      const res = await tequilapi.connection.status()
      await dispatch(type.SET_CONNECTION_STATUS, res.status)
    } catch (err) {
      commit(type.SHOW_ERROR, err)
    }
  },
  async [type.SET_CONNECTION_STATUS] ({commit, dispatch, state}, newStatus) {
    const oldStatus = state.status
    if (oldStatus === newStatus) {
      return
    }
    commit(type.SET_CONNECTION_STATUS, newStatus)

    if (newStatus === connectionStatus.CONNECTED) {
      await dispatch(type.START_ACTION_LOOPING, {
        action: type.CONNECTION_STATISTICS,
        threshold: 100
      })
    }
    if (oldStatus === connectionStatus.CONNECTED) {
      await dispatch(type.STOP_ACTION_LOOPING, type.CONNECTION_STATISTICS)
    }
    if (state.visibleStatus) {
      commit(type.SET_VISIBLE_STATUS, null)
    }
  },
  async [type.CONNECTION_STATISTICS] ({commit}) {
    try {
      const statistics = await tequilapi.connection.statistics()
      commit(type.CONNECTION_STATISTICS, statistics)
    } catch (err) {
      commit(type.SHOW_ERROR, err)
    }
  },
  async [type.CONNECT] ({commit, dispatch}, consumerId, providerId) {
    try {
      commit(type.SET_VISIBLE_STATUS, connectionStatus.CONNECTING)
      commit(type.CONNECTION_STATISTICS_RESET)
      await tequilapi.connection.connect(consumerId, providerId)
      commit(type.HIDE_ERROR)
    } catch (err) {
      commit(type.SHOW_ERROR_MESSAGE, messages.connectFailed)
      let error = new Error('Connection to node failed.')
      error.original = err
      throw error
    }
  },
  async [type.DISCONNECT] ({commit, dispatch}) {
    try {
      let res = tequilapi.connection.disconnect()
      commit(type.SET_VISIBLE_STATUS, type.tequilapi.DISCONNECTING)
      res = await res
      dispatch(type.FETCH_CONNECTION_STATUS)
      dispatch(type.CONNECTION_IP)
      return res
    } catch (err) {
      commit(type.SHOW_ERROR, err)
      throw (err)
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
