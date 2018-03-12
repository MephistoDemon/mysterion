/* eslint no-unused-expressions: 0 */

import lolex from 'lolex'
import { executeWithThreshold, ActionLooper } from '@/../app/utils'

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

  describe('ActionLooper', () => {
    describe('.start', () => {
      it('executes action multiple times with threshold', async () => {
        let counter = 0
        async function increaseCounter () {
          counter++
        }

        const looper = new ActionLooper(increaseCounter, 1000)
        looper.start()
        expect(counter).to.eql(1)

        clock.tick(1000)
        await realDelay(10)
        expect(counter).to.eql(2)

        clock.tick(2500)
        await realDelay(10)
        expect(counter).to.eql(3)

        clock.tick(1000)
        await realDelay(10)
        expect(counter).to.eql(4)
      })
    })

    describe('.stop', () => {
      it('stops action execution', async () => {
        let counter = 0
        async function increaseCounter () {
          counter++
        }

        const looper = new ActionLooper(increaseCounter, 1000)
        looper.start()
        expect(counter).to.eql(1)

        clock.tick(1000)
        await realDelay(10)
        expect(counter).to.eql(2)

        looper.stop()

        clock.tick(10000)
        await realDelay(10)
        expect(counter).to.eql(2)
      })
    })

    describe('.isRunning', () => {
      it('returns current looper state', async () => {
        const action = () => {}
        const looper = new ActionLooper(action, 1000)

        expect(looper.isRunning()).to.eql(false)

        looper.start()
        expect(looper.isRunning()).to.eql(true)

        looper.stop()
        expect(looper.isRunning()).to.eql(false)
      })
    })
  })

  describe('executeWithThreshold', () => {
    let actionDone, thresholdDone

    const syncAction = async () => {
      actionDone = true
    }

    const asyncAction = (duration) => async () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          actionDone = true
          resolve()
        }, duration)
      })
    }

    async function tickWithDelay (duration) {
      clock.tick(duration)
      await realDelay(10)
    }

    beforeEach(() => {
      actionDone = false
      thresholdDone = false
    })

    it('executes action with sync action', async () => {
      const executePromise = executeWithThreshold(syncAction, 10000).then(() => { thresholdDone = true })

      // not complete after 9s
      await tickWithDelay(9000)
      expect(actionDone).to.eql(true)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(9000)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })

    it('executes action with async action', async () => {
      const fastAsyncAction = asyncAction(5000)
      const executePromise = executeWithThreshold(fastAsyncAction, 10000).then(() => { thresholdDone = true })

      // not complete after 9s
      await tickWithDelay(9000)
      expect(actionDone).to.eql(true)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(1000)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })

    it('executes action with slow async action', async () => {
      const slowAsyncAction = asyncAction(5000)
      const executePromise = executeWithThreshold(slowAsyncAction, 10000).then(() => { thresholdDone = true })

      // not complete after 4s
      await tickWithDelay(4000)
      expect(actionDone).to.eql(false)
      expect(thresholdDone).to.eql(false)

      // complete after 10s
      await tickWithDelay(6000)
      expect(actionDone).to.eql(true)
      expect(thresholdDone).to.eql(true)

      await executePromise
    })
  })
})
