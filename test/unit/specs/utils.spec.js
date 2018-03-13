/* eslint no-unused-expressions: 0 */

import lolex from 'lolex'
import { executeWithThreshold, FunctionLooper } from '@/../app/utils'

describe('utils', () => {
  let realDelay, clock

  before(() => {
    const realSetTimeout = setTimeout
    realDelay = time => new Promise(resolve => realSetTimeout(() => resolve(), time))
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  async function tickWithDelay (duration) {
    clock.tick(duration)
    await realDelay(10)
  }

  describe('FunctionLooper', () => {
    describe('.start', () => {
      it('executes function multiple times with threshold', async () => {
        let counter = 0
        async function increaseCounter () {
          counter++
        }

        const looper = new FunctionLooper(increaseCounter, 1000)
        looper.start()
        expect(counter).to.eql(1)

        await tickWithDelay(1000)
        expect(counter).to.eql(2)

        await tickWithDelay(2500)
        expect(counter).to.eql(3)

        await tickWithDelay(1000)
        expect(counter).to.eql(4)
      })
    })

    describe('.stop', () => {
      it('stops function execution', async () => {
        let counter = 0
        async function increaseCounter () {
          counter++
        }

        const looper = new FunctionLooper(increaseCounter, 1000)
        looper.start()
        expect(counter).to.eql(1)

        await tickWithDelay(1000)
        expect(counter).to.eql(2)

        looper.stop()

        await tickWithDelay(10000)
        expect(counter).to.eql(2)
      })
    })

    describe('.isRunning', () => {
      it('returns current looper state', async () => {
        const func = () => {}
        const looper = new FunctionLooper(func, 1000)

        expect(looper.isRunning()).to.eql(false)

        looper.start()
        expect(looper.isRunning()).to.eql(true)

        looper.stop()
        expect(looper.isRunning()).to.eql(false)
      })
    })
  })

  describe('executeWithThreshold', () => {
    let funcDone, thresholdDone

    const syncFunc = async () => {
      funcDone = true
    }

    const asyncFunc = (duration) => async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          funcDone = true
          resolve()
        }, duration)
      })
    }

    beforeEach(() => {
      funcDone = false
      thresholdDone = false
    })

    it('executes function with sync function', async () => {
      const executePromise = executeWithThreshold(syncFunc, 10000).then(() => { thresholdDone = true })

      // not complete after 9s
      await tickWithDelay(9000)
      expect(funcDone).to.eql(true)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(9000)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })

    it('executes function with async function', async () => {
      const fastAsyncFunc = asyncFunc(5000)
      const executePromise = executeWithThreshold(fastAsyncFunc, 10000).then(() => { thresholdDone = true })

      // not complete after 9s
      await tickWithDelay(9000)
      expect(funcDone).to.eql(true)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(1000)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })

    it('executes function with slow async function', async () => {
      const slowAsyncFunc = asyncFunc(5000)
      const executePromise = executeWithThreshold(slowAsyncFunc, 1000).then(() => { thresholdDone = true })

      // not complete after 4s
      await tickWithDelay(4000)
      expect(funcDone).to.eql(false)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(6000)
      expect(funcDone).to.eql(true)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })
  })
})
