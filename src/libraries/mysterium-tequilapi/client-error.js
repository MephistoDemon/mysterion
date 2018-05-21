// @flow

const errorCodes = {
  CONNECTION_ABORTED_ERROR_CODE: 'ECONNABORTED'
}

const httpResponseCodes = {
  CLIENT_CLOSED_REQUEST: 499,
  SERVICE_UNAVAILABLE: 503
}

type AxiosError = {
  message: string,
  response?: { status: number },
  code?: string
}

function isNetworkError (error: Error): boolean {
  return error.message === 'Network Error'
}

function isTimeoutError (error: Error): boolean {
  const axiosError = (error: AxiosError)
  if (!axiosError.code) {
    return false
  }
  return axiosError.code === errorCodes.CONNECTION_ABORTED_ERROR_CODE
}

function isRequestClosedError (error: Error): boolean {
  return hasHttpStatus(error, httpResponseCodes.CLIENT_CLOSED_REQUEST)
}

function isServiceUnavailableError (error: Error): boolean {
  return hasHttpStatus(error, httpResponseCodes.SERVICE_UNAVAILABLE)
}

function hasHttpStatus (error: Error, expectedStatus: number): boolean {
  const axiosError = (error: AxiosError)
  if (!axiosError.response) {
    return false
  }

  return axiosError.response.status === expectedStatus
}

export { isNetworkError, isTimeoutError, isRequestClosedError, isServiceUnavailableError }
