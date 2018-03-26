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
  _currentExecutor: ThresholdExecutor
  _currentPromise: Promise<void>

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
        this._currentExecutor = new ThresholdExecutor(this.func, this.threshold)
        this._currentPromise = this._currentExecutor.execute()
        await this._currentPromise
      }
    }

    this._running = true
    loop()
  }

  async stop () {
    this._stopping = true

    this._currentExecutor.cancel()
    await this._currentPromise

    this._running = false
    this._stopping = false
  }

  isRunning () {
    return this._running
  }
}

/**
 * Executes given function and sleeps for remaining time.
 * If .cancel() is invoked, than sleep is skipped after function finishes.
 */
class ThresholdExecutor {
  _func: Function
  _threshold: number
  _canceled: boolean

  constructor (func: Function, threshold: number) {
    this._func = func
    this._threshold = threshold
    this._canceled = false
  }

  /**
   * Executes given function and sleeps for remaining time, if .cancel() was not invoked.
   * @returns {Promise<void>}
   */
  async execute (): Promise<void> {
    const elapsed = await this._timedExecution()
    if (this._canceled || elapsed >= this._threshold) {
      return
    }
    await sleep(this._threshold - elapsed)
  }

  /**
   * Forces currently function execution to skip sleep.
   */
  cancel () {
    this._canceled = true
  }

  async _timedExecution (): Promise<number> {
    const start = Date.now()
    await this._func()
    const end = Date.now()
    return end - start
  }
}

export { FunctionLooper, ThresholdExecutor }
