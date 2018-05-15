// @flow

/**
 * Returns a promise that is resolved after processing all currently queued events.
 */
function nextTick (): Promise<void> {
  return new Promise(resolve => process.nextTick(resolve))
}

/**
 * Runs async function and captures error of it's execution
 */
async function capturePromiseError (promise: Promise<any>): Promise<?Error> {
  try {
    await promise
  } catch (e) {
    return e
  }
  return null
}

/**
 * Resolves promise and captures error of it's execution
 */
async function captureAsyncError (func: () => Promise<any>) {
  return capturePromiseError(func())
}

export { nextTick, capturePromiseError, captureAsyncError }
