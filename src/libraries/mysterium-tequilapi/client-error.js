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
    return isNetworkError(this)
  }

  isTimeoutError (): boolean {
    return isTimeoutError(this.original)
  }

  isRequestClosedError (): boolean {
    return isRequestClosedError(this.original)
  }

  isServiceUnavailableError (): boolean {
    return isServiceUnavailableError(this.original)
  }
}

function isNetworkError (error: Error): boolean {
  return error.message === 'Network Error'
}

function isTimeoutError (error: Error): boolean {
  if (!error.code) {
    return false
  }
  return error.code === errorCodes.CONNECTION_ABORTED_ERROR_CODE
}

function isRequestClosedError (error: Error): boolean {
  return hasHttpStatus(error, httpResponseCodes.CLIENT_CLOSED_REQUEST)
}

function isServiceUnavailableError (error: Error): boolean {
  return hasHttpStatus(error, httpResponseCodes.SERVICE_UNAVAILABLE)
}

function hasHttpStatus (error: Error, expectedStatus: number): boolean {
  if (!error.response) {
    return false
  }

  return error.response.status === expectedStatus
}

export default TequilapiClientError
