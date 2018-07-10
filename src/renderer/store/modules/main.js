/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
// TODO: rename to `vpn.js` to be consistent with `Vpn.vue`
import type from '../types'
import type { TequilapiClient } from '../../../libraries/mysterium-tequilapi/client'
import NodeBuildInfoDTO from '../../../libraries/mysterium-tequilapi/dto/node-build-info'

type State = {
  init: string,
  visual: string,
  navOpen: boolean,
  clientBuildInfo: NodeBuildInfoDTO,
  navVisible: boolean,
  // TODO: merge `errorMessage` and `error` into one
  errorMessage: ?string,
  error: ?Error,
  showError: boolean
}

const state: State = {
  init: '',
  visual: 'head',
  navOpen: false,
  clientBuildInfo: new NodeBuildInfoDTO({}),
  navVisible: true,
  errorMessage: null,
  error: null,
  showError: false
}

const getters = {
  loading: (state: State) => (state.init === type.INIT_PENDING),
  visual: (state: State) => state.visual,
  navOpen: (state: State) => state.navOpen,
  navVisible: (state: State) => state.navVisible && state.init !== type.INIT_PENDING,
  clientBuildInfo: (state: State) => state.clientBuildInfo,
  errorMessage: (state: State) => state.errorMessage,
  showError: (state: State) => state.showError
}

const mutations = {
  [type.CLIENT_BUILD_INFO] (state: State, buildInfo: NodeBuildInfoDTO) {
    state.clientBuildInfo = buildInfo
  },
  [type.SET_NAV_OPEN] (state: State, open) {
    state.navOpen = open
  },
  [type.SET_NAV_VISIBLE] (state: State, visible: boolean) {
    state.navVisible = visible
  },
  // TODO: use enum for visual?
  [type.SET_VISUAL] (state: State, visual: string) {
    state.visual = visual
  },
  [type.INIT_SUCCESS] (state: State) {
    state.init = type.INIT_SUCCESS
  },
  [type.INIT_PENDING] (state: State) {
    state.init = type.INIT_PENDING
  },
  [type.INIT_FAIL] (state: State, err: ?Error) {
    state.init = type.INIT_FAIL
    state.error = err
  },
  [type.SHOW_ERROR] (state: State, errWithResponse: mixed) {
    let errorMessage = 'Unknown error'
    if (errWithResponse && errWithResponse.response && errWithResponse.response.data &&
      errWithResponse.response.data.message && typeof errWithResponse.response.data.message === 'string') {
      errorMessage = errWithResponse.response.data.message
    } else if (errWithResponse && errWithResponse.message && typeof errWithResponse.message === 'string') {
      errorMessage = errWithResponse.message
    }
    state.errorMessage = errorMessage
    state.showError = true
  },
  [type.SHOW_ERROR_MESSAGE] (state: State, errorMessage: string) {
    state.errorMessage = errorMessage
    state.showError = true
  },
  [type.HIDE_ERROR] (state: State) {
    state.showError = false
  }
}

function actionsFactory (tequilapi: TequilapiClient) {
  return {
    switchNav ({commit}, open: boolean) {
      commit(type.SET_NAV_OPEN, open)
    },
    setVisual ({commit}, visual: ?string) {
      commit(type.SET_VISUAL, visual)
    },
    async [type.CLIENT_BUILD_INFO] ({commit}) {
      const res = await tequilapi.healthCheck()
      commit(type.CLIENT_BUILD_INFO, res.buildInfo)
    },
    setNavVisibility ({commit}, visible: boolean) {
      commit(type.SET_NAV_VISIBLE, visible)
    }
  }
}

function factory (tequilapi: TequilapiClient) {
  return {
    state,
    mutations,
    getters,
    actions: actionsFactory(tequilapi)
  }
}

export {
  state,
  mutations,
  getters,
  actionsFactory
}
export default factory
