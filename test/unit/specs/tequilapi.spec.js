import { expect } from 'chai'
import MockAdapter from 'axios-mock-adapter'
import tequilastore from '../../../src/renderer/store/modules/tequilapi'
import tequilapi from '../../../src/api/tequilapi'
// import { testAction } from './helpers'

function testAction (action, payload, state, expectedMutations, done) {
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
// const teqAddr = 'http://localhost:4050'

const mock = new MockAdapter(tequilapi.__axio)

describe('new identity', () => {
  it('creates some new identity', async () => {
    mock.reset()
    mock.onPost('/identities').reply(200, {id: '0xC001FACE'})
    try {
      const a = await tequilapi.post('/identities', '')
      expect(a).to.be({})
    } catch (err) {
      expect(err).to.be.undefined
    }
  })
})

describe('tequilapi healthcheck', () => {
  it('throws network error', async () => {
    mock.onGet('/healthcheck').networkError()
    try {
      const a = await tequilapi.get('/healthcheck')
      expect(a).to.be.undefined
    } catch (err) {
      expect(err.message).to.eql('Network Error')
    }
  })

  it('throws timeout', async () => {
    mock.reset()
    mock.onGet('/healthcheck').timeout()
    try {
      const a = await tequilapi.get('/healthcheck')
      expect(a).to.be.undefined
    } catch (err) {
      expect(err.message).to.include('timeout')
    }
  })

  it('throws 404', async () => {
    mock.reset()
    mock.onGet('/healthcheck').reply(404)
    try {
      const health = await tequilapi.get('/healthcheck')
      expect(health).to.not.exist
    } catch (err) {
      expect(err.message).to.eql('Request failed with status code 404')
    }
  })
})



// describe('tequilapi store commits mutations on failed requests', () => {
//   const {actions} = tequilastore(tequilapi)
//   it('healthcheck (network error)', done => {
//     mock.onGet('/healthcheck').networkError()
//     testAction(actions.healthcheck, null, {}, [
//       { type: 'TEQUILAPI_FAILED_REQUEST' }
//     ], done)
//   })
//
//   it('identities 404', done => {
//     mock.reset()
//     mock.onGet('/idetities').reply(404)
//     testAction(actions.getIdentities, null, {}, [
//       { type: 'TEQUILAPI_FAILED_REQUEST' }
//     ], done)
//   })
//
//   it('identities empty', done => {
//     mock.reset()
//     mock.onGet('/idetities').reply(200, {identities: []})
//     //mock.onPut('/identities').reply(500)
//     testAction(actions.getIdentities, null, {}, [
//       { type: 'TEQUILAPI_FAILED_REQUEST' }
//     ], done)
//   })
// })

describe('tequilapi store', () => {
  const { actions, mutations, state } = tequilastore(tequilapi)

  it('healthcheck_state', done => {
    mutations.HEALTHCHECK(state, { uptime: '15m' })
    expect(state.mystCli.uptime).to.eql('15m')
    done()
  })
})
