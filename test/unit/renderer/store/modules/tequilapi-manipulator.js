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
