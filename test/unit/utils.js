function fakeTequilapiManipulator () {
  let statusFail = false
  let statisticsFail = false
  let ipFail = false
  const fakeError = new Error('Mock error')

  return {
    getFakeApi: function () {
      return {
        connection: {
          ip: async function () {
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
    },
    setStatusFail: function (value) {
      statusFail = value
    },
    setStatisticsFail: function (value) {
      statisticsFail = value
    },
    setIpFail: function (value) {
      ipFail = value
    },
    getFakeError: function () {
      return fakeError
    }
  }
}

export default { fakeTequilapiManipulator }
