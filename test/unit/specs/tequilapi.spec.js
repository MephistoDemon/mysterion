/* eslint-disable global-require */
import { expect } from 'chai'
const tequilapiInjector = require('!!vue-loader?inject!../../../src/renderer/store/modules/tequilapi')

const actions = tequilapiInjector({
  '../../../api/tequilapi': {
    actions: {
      async healthcheck () {
        setTimeout(() => {
          return { uptime: 'fake time' }
        }, 100)
      }
    }
  }
})

describe('tequilapi', () => {
  it('healthcheck', done => {
    testAction(actions, null, {}, [
      { type: 'HEALTHCHECK', payload: { uptime: 'fake time 3' } }
    ], done)
  })
})

// helper for testing action with expected mutations
const testAction = (action, payload, state, expectedMutations, done) => {
  let count = 0

  // mock commit
  const commit = (type, payload) => {
    const mutation = expectedMutations[count]

    try {
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload).to.deep.equal(payload)
      }
    } catch (error) {
      done(error)
    }

    count++
    if (count >= expectedMutations.length) {
      done()
    }
  }

  // call the action with mocked store and arguments
  console.log(action)
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}
