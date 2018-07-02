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

/**
 * Returns a promise that is resolved after processing all currently queued events.
 */
function nextTick (): Promise<void> {
  return new Promise(resolve => process.nextTick(resolve))
}

/**
 * Runs async function and captures error of it's execution.
 */
async function capturePromiseError (promise: Promise<any>): Promise<?Error> {
  try {
    await promise
  } catch (e) {
    return e
  }
  return null
}

function captureError (fn: () => any): ?Error {
  try {
    fn()
  } catch (e) {
    return e
  }
}

/**
 * Resolves promise and captures error of it's execution.
 */
async function captureAsyncError (func: () => Promise<any>) {
  return capturePromiseError(func())
}

/**
 * Records callback invocation. Useful for asserting that callback was invoked.
 */
class CallbackRecorder {
  invoked: boolean = false
  _argument: any = null
  _boundCallback: (any) => void

  /**
   * Returns function, which records it's invocation and argument
   * into current instance.
   *
   * @returns Function
   */
  getCallback (): (any) => void {
    if (!this._boundCallback) {
      this._boundCallback = this._record.bind(this)
    }
    return this._boundCallback
  }

  _record (argument: any): void {
    this.invoked = true
    this._argument = argument
  }

  get argument (): any {
    if (!this.invoked) {
      throw new Error('CallbackRecorder: callback was not invoked, so no available argument')
    }
    return this._argument
  }
}

export { nextTick,
  capturePromiseError,
  captureAsyncError,
  captureError,
  CallbackRecorder }
