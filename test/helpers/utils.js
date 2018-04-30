/**
 * Returns a promise that is resolved after processing all currently queued events.
 * @returns {Promise<void>}
 */
function nextTick () {
  return new Promise(resolve => process.nextTick(resolve))
}

/**
 * Resolved promise and returns error of it's execution
 *
 * @param {Promise<*>} promise
 * @return Error|nil
 */
async function capturePromiseError (promise) {
  try {
    await promise
  } catch (e) {
    return e
  }
  return null
}

async function captureAsyncError (func) {
  return capturePromiseError(func())
}

export { nextTick, capturePromiseError, captureAsyncError }
