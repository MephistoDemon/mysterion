const CONNECTION_ABORTED_ERROR_CODE = 'ECONNABORTED'

const responseCodes = {
  CLOSED_REQUEST: 499
}

function isTimeoutError (error) {
  return error.code === CONNECTION_ABORTED_ERROR_CODE
}

function hasHttpStatus (err, expectedStatus) {
  let status = null
  if (err.response) {
    status = err.response.status
  }
  return status === expectedStatus
}

export {
  isTimeoutError,
  hasHttpStatus,
  CONNECTION_ABORTED_ERROR_CODE,
  responseCodes
}
