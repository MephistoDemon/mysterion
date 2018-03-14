import type from '../types'
import tequilAPI from '../../../libraries/api/tequilapi'
import {isTimeoutError} from '../../../libraries/api/errors'
import messages from '../../../app/messages'
import {FunctionLooper} from '../../../libraries/functionLooper'
import config from '../../config'
// TODO tequilAPI should be passed via DI
const tequilapi = tequilAPI()

const defaultStatistics = {
}

const state = {
  ip: null,
  status: 'NotConnected',
  statistics: defaultStatistics,
  updateLooper: null
}

const getters = {
  status: state => state.status,
  connection: state => state,
  ip: state => state.ip
}

const mutations = {
  [type.CONNECTION_STATUS] (state, status) {
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
  [type.SET_UPDATE_LOOPER] (state, updateLooper) {
    state.updateLooper = updateLooper
  }
}

const actions = {
  async [type.START_STATISTICS_LOOP] ({dispatch, commit}) {
    const looper = await dispatch(type.START_ACTION_LOOPING, {
      action: type.CONNECTION_STATISTICS,
      threshold: config.statusUpdateThreshold
    })
    commit(type.SET_UPDATE_LOOPER, looper)
  },
  [type.STOP_STATISTICS_LOOP] ({commit, state}) {
    const looper = state.updateLooper
    if (looper) {
      looper.stop()
    }
    commit(type.SET_UPDATE_LOOPER, null)
  },
  async [type.CONNECTION_IP] ({commit}) {
    try {
      const ip = await tequilapi.connection.ip()
      commit(type.CONNECTION_IP, ip)
    } catch (err) {
      if (isTimeoutError(err)) {
        return
      }
      commit(type.SHOW_ERROR, err)
      // TODO: send to sentry
    }
  },
  async [type.START_ACTION_LOOPING] ({dispatch}, {action, threshold}) {
    const func = () => dispatch(action)
    const looper = new FunctionLooper(func, threshold)
    looper.start()
    return looper
  },
  async [type.CONNECTION_STATUS] ({commit}) {
    try {
      const res = await tequilapi.connection.status()
      commit(type.CONNECTION_STATUS, res.status)
    } catch (err) {
      commit(type.SHOW_ERROR, err)
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
      commit(type.CONNECTION_STATUS, type.tequilapi.CONNECTING)
      commit(type.CONNECTION_STATISTICS_RESET)
      await tequilapi.connection.connect(consumerId, providerId)
      commit(type.HIDE_ERROR)
      // if we ask openvpn right away status still in not connected state
      setTimeout(() => {
        dispatch(type.START_STATISTICS_LOOP)
      }, 1000)
    } catch (err) {
      commit(type.SHOW_ERROR_MESSAGE, messages.connectFailed)
      let error = new Error('Connection to node failed.')
      error.original = err
      throw error
    }
  },
  async [type.DISCONNECT] ({commit, dispatch}) {
    try {
      await dispatch(type.STOP_STATISTICS_LOOP)
      let res = tequilapi.connection.disconnect()
      commit(type.CONNECTION_STATUS, type.tequilapi.DISCONNECTING)
      res = await res
      dispatch(type.CONNECTION_STATUS)
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
