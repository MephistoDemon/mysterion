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

import VpnInitializer from '../../../src/app/vpnInitializer'
import { beforeEach, describe, expect, it } from '../../helpers/dependencies'
import type { State as IdentityState } from '../../../src/renderer/store/modules/identity'
import IdentityDTO from '../../../src/libraries/mysterium-tequilapi/dto/identity'
import types from '../../../src/renderer/store/types'
import { capturePromiseError } from '../../helpers/utils'

function tequilapiMockCreate (version: string): Object {
  const healtcheckResponse = {
    version: {
      commit: version
    }
  }

  return {
    healthCheck: () => Promise.resolve(healtcheckResponse)
  }
}

// TODO: refactor to TequilapiManipulator class
function tequilapiMockIdentitiesList (tequilapi: Object, identities: Array<IdentityDTO>) {
  tequilapi.identitiesList = () => Promise.resolve(identities)
}

function tequilapiMockIdentityCreate (tequilapi: Object, identity: IdentityDTO) {
  tequilapi.identityCreate = () => Promise.resolve(identity)
}

function tequilapiMockIdentityUnlock (tequilapi: Object) {
  tequilapi.identityUnlock = () => Promise.resolve()
}

function tequilapiMockIdentitiesListError (tequilapi: Object, error: Error) {
  tequilapi.identitiesList = () => Promise.reject(error)
}

function tequilapiMockIdentityUnlockError (tequilapi: Object, error: Error) {
  tequilapi.identityUnlock = () => Promise.reject(error)
}

describe('VpnInitializer', () => {
  describe('initialize()', () => {
    let tequilapi

    beforeEach(() => {
      tequilapi = tequilapiMockCreate('test version')
    })

    describe('has some identities', () => {
      const mockIdentity = new IdentityDTO({id: '0xC001FACE'})

      beforeEach(() => {
        tequilapiMockIdentitiesList(tequilapi, [mockIdentity])
        tequilapiMockIdentityUnlock(tequilapi)
      })

      it('stores first fetched identity', async () => {
        const dispatched = []
        const dispatch = (...args: Array<any>) => {
          dispatched.push(args)
        }
        const committed = []
        const commit = (...args: Array<any>) => {
          committed.push(args)
          // TODO: think what to do with this mutation implementation
          if (args.length === 2 && args[0] === types.IDENTITY_GET_SUCCESS) {
            state.current = args[1]
          }
        }
        const state: IdentityState = { current: null, unlocked: false }
        await new VpnInitializer(tequilapi).initialize(dispatch, commit, state)

        expect(state.current).to.eql(mockIdentity)
        console.log('dispatched:', dispatched)
        console.log('committed:', committed)
      })
    })

    describe('has not found preset identities', () => {
      const mockCreatedIdentity = new IdentityDTO({id: '0xC001FACY'})

      beforeEach(() => {
        tequilapiMockIdentitiesList(tequilapi, [])
        tequilapiMockIdentityCreate(tequilapi, mockCreatedIdentity)
        tequilapiMockIdentityUnlock(tequilapi)
      })

      it('creates and unlocks identity', async () => {
        const dispatched = []
        const dispatch = (...args: Array<any>) => {
          dispatched.push(args)
        }
        const committed = []
        let initNewUser = false
        const commit = (...args: Array<any>) => {
          committed.push(args)
          // TODO: think what to do with this mutation implementation
          if (args.length === 2 && args[0] === types.IDENTITY_GET_SUCCESS) {
            console.log('identity', args[1])
            state.current = args[1]
          }

          if (args.length === 1 && args[0] === types.IDENTITY_UNLOCK_SUCCESS) {
            state.unlocked = true
          }

          if (args.length === 1 && args[0] === types.INIT_NEW_USER) {
            initNewUser = true
          }
        }
        const state: IdentityState = { current: null, unlocked: false }
        await new VpnInitializer(tequilapi).initialize(dispatch, commit, state)

        console.log('dispatched:', dispatched)
        console.log('committed:', committed)
        console.log(state)
        expect(state.current).to.eql(mockCreatedIdentity)
        expect(state.unlocked).to.eql(true)
        expect(initNewUser).to.be.true
      })
    })

    describe('identities error handling', () => {
      const mockError = new Error('Failed')

      describe('identity listing failed', () => {
        beforeEach(() => {
          tequilapiMockIdentitiesListError(tequilapi, mockError)
        })

        it('throws exception', async () => {
          const dispatched = []
          const dispatch = (...args: Array<any>) => {
            dispatched.push(args)
          }
          const committed = []
          const commit = (...args: Array<any>) => {
            committed.push(args)
          }
          const state: IdentityState = { current: null, unlocked: false }
          const err = await capturePromiseError(new VpnInitializer(tequilapi).initialize(dispatch, commit, state))

          expect(err).to.eql(mockError)
        })
      })

      describe('identity unlocking failed', () => {
        beforeEach(() => {
          tequilapiMockIdentitiesList(tequilapi, [new IdentityDTO({id: '0xC001FACE'})])
          tequilapiMockIdentityUnlockError(tequilapi, mockError)
        })

        it('throws exception', async () => {
          const dispatched = []
          const dispatch = (...args: Array<any>) => {
            dispatched.push(args)
          }
          const committed = []
          const commit = (...args: Array<any>) => {
            committed.push(args)
            if (args.length === 2 && args[0] === types.IDENTITY_GET_SUCCESS) {
              state.current = args[1]
            }
          }
          const state: IdentityState = { current: null, unlocked: false }
          await new VpnInitializer(tequilapi).initialize(dispatch, commit, state)

          expect(committed[committed.length - 1]).to.eql([
            types.SHOW_ERROR,
            mockError
          ])
        })
      })
    })
  })
})
