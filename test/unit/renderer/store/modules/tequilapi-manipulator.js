// @flow
import ConnectionIPDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-ip'
import ConnectionStatusDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-status'
import ConnectionStatisticsDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/connection-statistics'
import TequilapiClientError from '../../../../../src/libraries/mysterium-tequilapi/client-error'

class TimeoutError extends Error {
  isTimeoutError (): boolean {
    return true
  }
}

class RequestClosedError extends Error {
  isTimeoutError (): boolean {
    return false
  }

  isRequestClosedError (): boolean {
    return true
  }
}

function factoryTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  let ipTimeout = false
  let connectFail = false
  let connectFailClosedRequest = false

  const errorMock = new TequilapiClientError('Mock error')
  const timeoutErrorMock = new TimeoutError('Mock timeout error')
  const closedRequestErrorMock = new RequestClosedError('Mock closed request error')

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
    setStatusFail: function (error: Error) {
      statusFail = error
    },
    setStatisticsFail: function (error: Error) {
      statisticsFail = error
    },
    setIpTimeout: function (error: Error) {
      ipTimeout = error
    },
    setIpFail: function (error: Error) {
      ipFail = error
    },
    setConnectFail: function (error: Error) {
      connectFail = error
    },
    setConnectFailClosedRequest: function (error: Error) {
      connectFailClosedRequest = error
    },
    getFakeError: function (): Error {
      return errorMock
    },
    getFakeTimeoutError: function (): Error {
      return timeoutErrorMock
    }
  }
}

export default factoryTequilapiManipulator
