import type from '../types'

const state = {
  status: ''
}

const getters = {
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
  },
  statusText: (state) => {
    let text = 'Disconnected'
    switch (state.status) {
      case 'Connected':
        text = 'Connected'
        break
      case 'Connecting':
        text = 'Connecting'
        break
      case 'NotConnected':
        text = 'Disconnected'
        break
      case 'Disconnecting':
        text = 'Disconnecting'
        break
    }

    return text
  }
}

const mutations = {
  [type.CONNECTION_STATUS] (state, status) {
    state.status = status
  }
}

function factory (tequilapi) {
  const actions = {
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

  return {
    state,
    mutations,
    getters,
    actions
  }
}

export default factory
