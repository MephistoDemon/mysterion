const delay = time => new Promise(resolve => setTimeout(() => resolve(), time))

/**
 * Executes given action method infinitely.
 * Ensures that time between executed actions is below given threshold.
 * @constructor
 * @param {!function} action - Action to be executed
 * @param {!number} threshold - Minimum delay between action executions (in milliseconds).
 */
class ActionLooper {
  constructor (action, threshold) {
    this.action = action
    this.threshold = threshold
    this._running = false
  }

  start () {
    const loop = async () => {
      // eslint-disable-next-line no-unmodified-loop-condition
      while (this._running) {
        await executeWithThreshold(this.action, this.threshold)
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

async function executeWithThreshold (action, threshold) {
  const start = Date.now()
  await action()
  const end = Date.now()

  const elapsed = end - start
  if (elapsed < threshold) {
    await delay(threshold - elapsed)
  }
}

export { ActionLooper, executeWithThreshold }
