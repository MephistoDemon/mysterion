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
import ConnectionIPDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-ip'
import ConnectionStatusDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-status'
import ConnectionStatisticsDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-statistics'

function factoryTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  let ipTimeout = false
  let connectFail = false
  let connectFailClosedRequest = false

  const errorMock = new Error('Mock error')
  const timeoutErrorMock = createMockTimeoutError()
  const closedRequestErrorMock = createMockRequestClosedError()

  return {
    getFakeApi: function () {
      return {
        connectionIP: async function (): Promise<ConnectionIPDTO> {
          if (ipTimeout) {
            throw timeoutErrorMock
          }
          if (ipFail) {
            throw errorMock
          }
          return new ConnectionIPDTO({
            ip: 'mock ip'
          })
        },

        connectionStatus: async function (): Promise<ConnectionStatusDTO> {
          if (statusFail) {
            throw errorMock
          }
          return new ConnectionStatusDTO({
            status: 'mock status'
          })
        },

        connectionStatistics: async function (): Promise<ConnectionStatisticsDTO> {
          if (statisticsFail) {
            throw errorMock
          }
          return new ConnectionStatisticsDTO({duration: 1})
        },

        connectionCreate: async function (): Promise<ConnectionStatusDTO> {
          if (connectFailClosedRequest) {
            throw closedRequestErrorMock
          }
          if (connectFail) {
            throw errorMock
          }
          return new ConnectionStatusDTO({})
        },

        connectionCancel: async function (): Promise<ConnectionStatusDTO> {
          return new ConnectionStatusDTO({})
        }
      }
    },
    cleanup: function () {
      this.setStatusFail(false)
      this.setStatisticsFail(false)
      this.setIpFail(false)
      this.setIpTimeout(false)
      this.setConnectFail(false)
      this.setConnectFailClosedRequest(false)
    },
    setStatusFail: function (value: boolean) {
      statusFail = value
    },
    setStatisticsFail: function (value: boolean) {
      statisticsFail = value
    },
    setIpTimeout: function (value: boolean) {
      ipTimeout = value
    },
    setIpFail: function (value: boolean) {
      ipFail = value
    },
    setConnectFail: function (value: boolean) {
      connectFail = value
    },
    setConnectFailClosedRequest: function (value: boolean) {
      connectFailClosedRequest = value
    },
    getFakeError: function (): Error {
      return errorMock
    }
  }
}

function createMockTimeoutError (): Object {
  const error = new Error('Mock timeout error')
  const object = (error: Object)
  object.code = 'ECONNABORTED'
  return error
}

function createMockRequestClosedError (): Object {
  const error = new Error('Mock closed request error')
  const object = (error: Object)
  object.response = { status: 499 }
  return error
}

export default factoryTequilapiManipulator
