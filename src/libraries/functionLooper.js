// @flow
import {sleep} from './time'

/**
 * Executes given function infinitely.
 * Ensures that time between function executions is above given threshold.
 * @constructor
 * @param {!function} func - Function to be executed
 * @param {!number} threshold - Minimum sleep between function executions (in milliseconds).
 */
class FunctionLooper {
  func: Function
  threshold: number
  _running: boolean

  constructor (func: Function, threshold: number) {
    this.func = func
    this.threshold = threshold
    this._running = false
  }

  start () {
    const loop = async () => {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (this._running) {
        await executeWithThreshold(this.func, this.threshold)
      }
    }

    this._running = true
    loop()
  }

  stop () {
    this._running = false
  }

  isRunning () {
    return this._running
  }
}

async function executeWithThreshold (func: Function, threshold: number): Promise<void> {
  const start = Date.now()
  await func()
  const end = Date.now()

  const elapsed = end - start
  if (elapsed < threshold) {
    await sleep(threshold - elapsed)
  }
}

export { FunctionLooper, executeWithThreshold }
