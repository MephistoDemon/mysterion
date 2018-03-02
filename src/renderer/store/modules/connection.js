import type from '../types'
import tequilAPI from '../../../api/tequilapi'
import config from '../../config'
// TODO tequilAPI should be passed via DI
const tequilapi = tequilAPI()

let updaterTimeout

const state = {
  ip: null,
  status: 'NotConnected',
  stats: {
    bytesReceived: 0,
    bytesSent: 0,
    duration: 0
  }
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
  [type.CONNECTION_STATS] (state, stats) {
    state.stats = stats
  },
  [type.CONNECTION_IP] (state, ip) {
    state.ip = ip
  }
}

const actions = {
  async [type.STATUS_UPDATER_RUN] ({dispatch}) {
    await dispatch(type.CONNECTION_STATUS_ALL)
    updaterTimeout = setTimeout(() => {
      dispatch(type.STATUS_UPDATER_RUN)
    }, config.statusUpdateTimeout)
  },
  async [type.CONNECTION_IP] ({commit}) {
    try {
      const ip = await tequilapi.connection.ip()
      if (ip !== null) {
        commit(type.CONNECTION_IP, ip)
      }
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw err
    }
  },
  async [type.CONNECTION_STATUS_ALL] ({commit}) {
    try {
      const statusPromise = tequilapi.connection.status()
      const statsPromise = tequilapi.connection.statistics()
      const ipPromise = tequilapi.connection.ip()
      const status = await statusPromise
      const stats = await statsPromise
      commit(type.CONNECTION_STATUS, status.status)
      commit(type.CONNECTION_STATS, stats)
      const ip = await ipPromise
      if (ip !== null) {
        commit(type.CONNECTION_IP, ip)
      }
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
    }
  },
  async [type.CONNECTION_STATUS] ({commit}) {
    const res = await tequilapi.connection.status()
    commit(type.CONNECTION_STATUS, res.status)
  },
  async [type.CONNECT] ({commit, dispatch}, consumerId, providerId) {
    try {
      commit(type.CONNECTION_STATUS, type.tequilapi.CONNECTING)
      await tequilapi.connection.connect(consumerId, providerId)
      commit(type.HIDE_REQ_ERR)
      // if we ask openvpn right away status stil in not connected state
      updaterTimeout = setTimeout(() => {
        dispatch(type.STATUS_UPDATER_RUN)
      }, 1000)
    } catch (err) {
      let error = new Error('Connection to node failed. Try other one')
      error.original = err
      commit(type.REQUEST_FAIL, error)
      throw (error)
    }
  },
  async [type.DISCONNECT] ({commit, dispatch}) {
    try {
      clearTimeout(updaterTimeout)
      let res = tequilapi.connection.disconnect()
      commit(type.CONNECTION_STATUS, type.tequilapi.DISCONNECTING)
      res = await res
      dispatch(type.CONNECTION_STATUS)
      dispatch(type.CONNECTION_IP)
      return res
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
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
