import { expect } from 'chai'
import tequilastore from '../../../src/renderer/store/modules/tequilapi'
import tequilaClient from '../../../src/api/tequilapi'

// const tequilapiClient = {
//   getIdentities: function () {
//     let res = new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ identities: [] })
//       }, 100)
//     })
//     return res
//   },
//   healthcheck: function () {
//     let res = new Promise((resolve) => {
//       setTimeout(() => {
//         resolve({ uptime: 'fake time' })
//       }, 100)
//     })
//     return res
//   }
// }

describe('tequilapi', () => {
  // const actions = tequilastore.actionsFactory(tequilapiClient)
  const { actions, mutations, state } = tequilastore(tequilaClient)
  it('getsIdentities_action', done => {
    testAction(actions.getIdentities, null, {}, [
      { type: 'GOT_IDS', payload: { identities: [''] } }
    ], done)
  })
  it('healthcheck_action', done => {
    testAction(actions.healthcheck, null, {}, [
      { type: 'HEALTHCHECK', payload: { uptime: 'fake time' } }
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
  action({ commit, state }, payload)

  // check if no mutations should have been dispatched
  if (expectedMutations.length === 0) {
    expect(count).to.equal(0)
    done()
  }
}
