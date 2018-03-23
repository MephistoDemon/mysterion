import {CONNECTION_ABORTED_ERROR_CODE} from '../../src/libraries/api/errors'

function fakeTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  let ipTimeout = false
  const fakeError = new Error('Mock error')
  const fakeTimeoutError = new Error('Mock timeout error')
  fakeTimeoutError.code = CONNECTION_ABORTED_ERROR_CODE

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
          }
        }
      }
    },
    cleanup: function () {
      this.setStatusFail(false)
      this.setStatisticsFail(false)
      this.setIpFail(false)
      this.setIpTimeout(false)
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

export default { fakeTequilapiManipulator, nextTick }
