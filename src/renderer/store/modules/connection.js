import type from '../types'
import tequilAPI from '../../../api/tequilapi'

const tequilapi = tequilAPI()

const state = {
  status: ''
}

const getters = {
  connectionStatus: state => 'Connecting'
}

const mutations = {
  [type.CONNECTION_STATUS_SET] (state, status) {
    state.status = status
  }
}

const actions = {
  async [type.CONNECTION_STATUS] ({commit}) {
    try {
      const connStatus = await tequilapi.connection.status()
      commit(type.CONNECTION_STATUS_SET, connStatus.status)
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
