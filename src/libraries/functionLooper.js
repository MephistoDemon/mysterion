/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import sleep from './sleep'
import Subscriber from './subscriber'

/**
 * Executes given function infinitely.
 * Ensures that time between function executions is above given threshold.
 * @constructor
 * @param {!function} func - Function to be executed
 * @param {!number} threshold - Minimum sleep between function executions (in milliseconds).
 */
class FunctionLooper {
  _func: AsyncFunctionWithoutParams
  _threshold: number
  _running: boolean = false
  _stopping: boolean = false
  _errorSubscriber: Subscriber<Error> = new Subscriber()
  _currentExecutor: ?ThresholdExecutor
  _currentPromise: ?Promise<void>

  constructor (func: AsyncFunctionWithoutParams, threshold: number) {
    this._func = func
    this._threshold = threshold
  }

  start (): void {
    if (this.isRunning()) {
      return
    }

    const loop = async () => {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (this._running && !this._stopping) {
        this._currentExecutor = new ThresholdExecutor(this._func, this._threshold)
        this._currentPromise = this._currentExecutor.execute()
        try {
          await this._currentPromise
        } catch (err) {
          this._errorSubscriber.notify(err)
        }
      }
    }

    this._running = true
    loop()
  }

  async stop (): Promise<void> {
    this._stopping = true

    await this._waitForStartedPromise()

    this._running = false
    this._stopping = false
  }

  isRunning (): boolean {
    return this._running
  }

  onFunctionError (callback: (Error) => void) {
    this._errorSubscriber.subscribe(callback)
  }

  async _waitForStartedPromise (): Promise<void> {
    if (!this._currentExecutor) {
      return
    }
    this._currentExecutor.cancel()
    await this._currentPromise
  }
}

type AsyncFunctionWithoutParams = () => Promise<any>

/**
 * Executes given function and sleeps for remaining time.
 * If .cancel() is invoked, than sleep is skipped after function finishes.
 */
class ThresholdExecutor {
  _func: AsyncFunctionWithoutParams
  _threshold: number
  _canceled: boolean

  constructor (func: AsyncFunctionWithoutParams, threshold: number) {
    this._func = func
    this._threshold = threshold
    this._canceled = false
  }

  /**
   * Executes given function and sleeps for remaining time, if .cancel() was not invoked.
   * @returns {Promise<void>}
   */
  async execute (): Promise<void> {
    const executionResult = await this._executeFunction()
    await this._sleepRemainingTime(executionResult.duration)
    if (executionResult.error) {
      throw executionResult.error
    }
  }

  /**
   * Forces currently function execution to skip sleep.
   */
  cancel () {
    this._canceled = true
  }

  async _executeFunction (): Promise<ExecutionResult> {
    const start = Date.now()
    let error = null
    try {
      await this._func()
    } catch (err) {
      error = err
    }
    const end = Date.now()
    return { duration: end - start, error }
  }

  async _sleepRemainingTime (duration: number): Promise<void> {
    const sleepTime = this._remainingSleepTime(duration)
    if (sleepTime > 0) {
      await sleep(sleepTime)
    }
  }

  _remainingSleepTime (duration: number): number {
    if (this._canceled || duration >= this._threshold) {
      return 0
    }
    return this._threshold - duration
  }
}

// Internal type for capturing duration and error of function
type ExecutionResult = {
  error: ?Error,
  duration: number
}

export { FunctionLooper, ThresholdExecutor }
