import _ from 'lodash'

const CONNECTION_ABORTED_ERROR_CODE = 'ECONNABORTED'

function isTimeoutError (error) {
  return error.code === CONNECTION_ABORTED_ERROR_CODE
}

function haveHttpStatus (err, expectedStatus) {
  const status = _.get(err, 'response.status')
  return status === expectedStatus
}

export {
  isTimeoutError,
  haveHttpStatus,
  CONNECTION_ABORTED_ERROR_CODE
}
