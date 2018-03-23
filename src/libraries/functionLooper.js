// @flow
import sleep from './sleep'

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
  _stopping: boolean
  _currentExecutionPromise: Promise<void>

  constructor (func: Function, threshold: number) {
    this.func = func
    this.threshold = threshold
    this._running = false
  }

  start () {
    if (this.isRunning()) {
      return
    }

    const loop = async () => {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (this._running && !this._stopping) {
        this._currentExecutionPromise = new Promise(resolve => {
          executeWithThreshold(this.func, this.threshold).then(() => { resolve() })
        })
        await this._currentExecutionPromise
      }
    }

    this._running = true
    loop()
  }

  async stop () {
    this._stopping = true
    if (this._currentExecutionPromise) {
      await this._currentExecutionPromise
    }
    this._running = false
    this._stopping = false
  }

  isRunning () {
    return this._running
  }
}

async function executeWithThreshold (func: Function, threshold: number): Promise<void> {
  const start = Date.now()
  await func()
  const end = Date.now()

  // TODO: allow skipping sleep when stopping FunctionLooper
  const elapsed = end - start
  if (elapsed < threshold) {
    await sleep(threshold - elapsed)
  }
}

export { FunctionLooper, executeWithThreshold }
