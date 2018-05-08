// @flow

const errorCodes = {
  CONNECTION_ABORTED_ERROR_CODE: 'ECONNABORTED'
}

const httpResponseCodes = {
  CLIENT_CLOSED_REQUEST: 499,
  SERVICE_UNAVAILABLE: 503
}

class TequilapiClientError extends Error {
  original: Error

  constructor (original: Error) {
    super()
    super.name = this.constructor.name
    super.message = original.message
    super.stack = original.stack

    this.original = original
  }

  isNetworkError (): boolean {
    return this.message === 'Network Error'
  }

  isTimeoutError (): boolean {
    if (!this.original.code) {
      return false
    }
    return this.original.code === errorCodes.CONNECTION_ABORTED_ERROR_CODE
  }

  isRequestClosedError (): boolean {
    return hasHttpStatus(this.original, httpResponseCodes.CLIENT_CLOSED_REQUEST)
  }

  isServiceUnavailableError (): boolean {
    return hasHttpStatus(this.original, httpResponseCodes.SERVICE_UNAVAILABLE)
  }
}

function hasHttpStatus (error: Error, expectedStatus: number): boolean {
  if (!error.response) {
    return false
  }

  return error.response.status === expectedStatus
}

export default TequilapiClientError
