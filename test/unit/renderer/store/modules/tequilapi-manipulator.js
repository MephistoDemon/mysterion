import {CONNECTION_ABORTED_ERROR_CODE, httpResponseCodes} from '../../../../../src/libraries/api/errors'

function factoryTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  let ipTimeout = false
  let connectFail = false
  let connectFailClosedRequest = false
  const fakeError = new Error('Mock error')
  const fakeTimeoutError = new Error('Mock timeout error')
  fakeTimeoutError.code = CONNECTION_ABORTED_ERROR_CODE
  const fakeClosedRequestError = new Error('Mock closed request error')
  fakeClosedRequestError.response = { status: httpResponseCodes.CLIENT_CLOSED_REQUEST }

  return {
    getFakeApi: function () {
      return {
        connection: {
          ip: async function () {
            if (ipTimeout) {
              throw fakeTimeoutError
            }
            if (ipFail) {
              throw fakeError
            }
            return 'mock ip'
          },
          status: async function () {
            if (statusFail) {
              throw fakeError
            }
            return {
              status: 'mock status'
            }
          },
          statistics: async function () {
            if (statisticsFail) {
              throw fakeError
            }
            return 'mock statistics'
          },
          connect: async function ({consumerId, providerId}) {
            if (connectFailClosedRequest) {
              throw fakeClosedRequestError
            }
            if (connectFail) {
              throw fakeError
            }
            return null
          },
          disconnect: async () => null
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
    setStatusFail: function (value) {
      statusFail = value
    },
    setStatisticsFail: function (value) {
      statisticsFail = value
    },
    setIpTimeout: function (value) {
      ipTimeout = value
    },
    setIpFail: function (value) {
      ipFail = value
    },
    setConnectFail: function (value) {
      connectFail = value
    },
    setConnectFailClosedRequest: function (value) {
      connectFailClosedRequest = value
    },
    getFakeError: function () {
      return fakeError
    },
    getFakeTimeoutError: function () {
      return fakeTimeoutError
    }
  }
}

export default factoryTequilapiManipulator
