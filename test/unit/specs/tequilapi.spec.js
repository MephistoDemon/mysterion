import { expect } from 'chai'
import tequilastore from '../../../src/renderer/store/modules/tequilapi'
// import tequilaClient from '../../../src/api/tequilapi'

const tequilapiFake = {
  getIdentities: function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { identities: [{ id: 'fake' }] } })
      }, 100)
    })
  },
  healthcheck: function () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { uptime: 'fake time', process: 3 } })
      }, 100)
    })
  }
}

describe('tequilapi', () => {
  // const { actions, mutations, state } = tequilastore(tequilaClient)
  const { actions, mutations, state } = tequilastore(tequilapiFake)
  it('getsIdentities_action', done => {
    testAction(actions.getIdentities, null, {}, [
      { type: 'GOT_IDS', payload: { identities: [{ id: 'fake' }] } }
    ], done)
  })

  it('healthcheck_action', done => {
    testAction(actions.healthcheck, null, {}, [
      { type: 'HEALTHCHECK', payload: { uptime: 'fake time', process: 3 } }
    ], done)
  })

  it('healthcheck_state', done => {
    mutations.HEALTHCHECK(state, { uptime: '15m' })
    expect(state.uptime).to.eql('15m')
    done()
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
      if (mutation.payload) {
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
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}
