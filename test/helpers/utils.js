import { CONNECTION_ABORTED_ERROR_CODE, CLOSED_REQUEST_CODE } from '../../src/libraries/api/errors'

function fakeTequilapiManipulator () {
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
  fakeClosedRequestError.response = { status: CLOSED_REQUEST_CODE }

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

/**
 * Returns a promise that is resolved after processing all currently queued events.
 * @returns {Promise<void>}
 */
function nextTick () {
  return new Promise(resolve => process.nextTick(resolve))
}

const captureAsyncError = async (func) => {
  try {
    await func()
  } catch (e) {
    return e
  }
  return null
}

export default { fakeTequilapiManipulator, nextTick, captureAsyncError }
