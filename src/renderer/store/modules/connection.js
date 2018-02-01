import type from '../types'
import tequilAPI from '../../../api/tequilapi'

const tequilapi = tequilAPI()

const state = {
  ip: null,
  status: 'NotConnected',
  stats: {
    bytesReceived: '-;-',
    bytesSent: '@__@',
    duration: 'u.u'
  }
}

const getters = {
  connection: state => state,
  ip: state => state.ip,
  isConnected: (state) => {
    return state.status === 'Connected'
  },
  isDisconnected: state => state.status === 'NotConnected',
  isConnecting: state => (state.status === 'Connecting'),
  isDisconnecting: state => (state.status === 'Disconnecting'),
  buttonText: (state) => {
    let text = 'Connect'
    switch (state.status) {
      case 'Connected':
        text = 'Disconnect'
        break
      case 'Connecting':
        text = 'Connecting'
        break
      case 'NotConnected':
        text = 'Connect'
        break
      case 'Disconnecting':
        text = 'Disconnecting'
        break
    }
    return text
  }
}

const mutations = {
  [type.CONNECTION_IP_SET] (state, data) {
    state.ip = data.ip
  },
  [type.CONNECTION_STATUS_SET] (state, data) {
    state.status = data.status
    state.stats = data.stats
    state.ip = data.ip
  },
  [type.CONNECTION_STATUS] (state, status) {
    state.status = status
  }
}

const actions = {
  async [type.CONNECTION_IP_GET] ({commit}) {
    try {
      const res = await tequilapi.connection.ip()
      commit(type.CONNECTION_IP_SET, res)
      return res.ip
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw err
    }
  },
  async [type.CONNECTION_STATUS] ({commit}) {
    try {
      const statusPromise = tequilapi.connection.status()
      const statsPromise = tequilapi.connection.statistics()
      const ipPromise = tequilapi.connection.ip()
      const [status, stats, ip] = await Promise.all([statusPromise, statsPromise, ipPromise])
      commit(type.CONNECTION_STATUS_SET, {status: status.status, stats, ip: ip.ip})
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  },

  async connect ({commit}, identity, nodeId) {
    try {
      const res = await tequilapi.connection.connect(identity, nodeId)
      commit(type.CONNECTION_STATUS, res.status)
      return res
    } catch (err) {
      commit(type.REQUEST_FAIL, err)
      throw (err)
    }
  },
  async disconnect ({commit}) {
    try {
      const res = await tequilapi.connection.disconnect()
      commit(type.CONNECTION_STATUS, res.status)
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
