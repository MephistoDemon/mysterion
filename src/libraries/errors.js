const CONNECTION_ABORTED_ERROR_CODE = 'ECONNABORTED'

function isTimeoutError (error) {
  return error.code === CONNECTION_ABORTED_ERROR_CODE
}

export {
  isTimeoutError,
  CONNECTION_ABORTED_ERROR_CODE
}
