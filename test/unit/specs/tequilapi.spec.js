import { expect } from 'chai'
import tequilastore from '../../../src/renderer/store/modules/tequilapi'
// import tequilapi from '../../../src/api/tequilapi'

const rejectErr = new Error('Tequila is dead. Network Error')

const tequilapiFakeReject = {
  getIdentities () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(rejectErr)
      }, 100)
    })
  },
  healthcheck () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(rejectErr)
      }, 100)
    })
  }
}

const tequilapiFake = {
  getIdentities () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { identities: [{ id: 'fake' }] } })
      }, 100)
    })
  },
  healthcheck () {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: { uptime: 'fake time', process: 3 } })
      }, 100)
    })
  }
}

describe('tequilapi_rejected', () => {
  const {actions} = tequilastore(tequilapiFakeReject)
  it('healthcheck_rejected', done => {
    testAction(actions.healthcheck, null, {}, [
      { type: 'TEQUILAPI_FAILED_REQUEST', payload: rejectErr }
    ], done)
  })

  it('getsIdentities_rejected', done => {
    testAction(actions.getIdentities, null, {}, [
      { type: 'TEQUILAPI_FAILED_REQUEST', payload: rejectErr }
    ], done)
  })
})

describe('tequilapi', () => {
  const { actions, mutations, state } = tequilastore(tequilapiFake)
  describe('getIdetities', () => {
    it('dispatches mutation', done => {
      testAction(actions.getIdentities, null, {}, [
        { type: 'GOT_IDS', payload: { identities: [{ id: 'fake' }] } }
      ], done)
    })
  })

  it('healthcheck_action', done => {
    testAction(actions.healthcheck, null, {}, [
      { type: 'HEALTHCHECK', payload: { uptime: 'fake time', process: 3 } }
    ], done)
  })

  it('healthcheck_state', done => {
    mutations.HEALTHCHECK(state, { uptime: '15m' })
    expect(state.mystCli.uptime).to.eql('15m')
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
        expect(payload).to.eql(mutation.payload)
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
