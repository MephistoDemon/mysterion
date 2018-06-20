/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
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

import { describe, it, expect, beforeEach } from '../../../helpers/dependencies'
import { BackendLogCachingTransport, BackendLogCommunicationTransport }
  from '../../../../src/app/logging/backend-logging-transports'
import LogCache from '../../../../src/app/logging/log-cache'
import FakeMainCommunication from '../../../helpers/fakeMainCommunication'

describe('BackendLogCachingTransport', () => {
  describe('.log', () => {
    let backendCachingTransport, logCache
    beforeEach(() => {
      logCache = new LogCache()
      backendCachingTransport = new BackendLogCachingTransport(logCache)
    })

    it('adds data to error log cache', (done) => {
      backendCachingTransport.log({level: 'error', message: 'text'}, () => {
        expect(logCache.get().error).to.be.eql(['text'])
        done()
      })
    })

    it('adds data to info log cache for log levels (info, warn, debug)', (done) => {
      backendCachingTransport.log({level: 'info', message: 'INFO'}, () => {
        backendCachingTransport.log({level: 'warn', message: 'WARNING'}, () => {
          backendCachingTransport.log({level: 'debug', message: 'DEBUG'}, () => {
            expect(logCache.get().info).to.be.eql(['INFO', 'WARNING', 'DEBUG'])
            done()
          })
        })
      })
    })
  })
})

describe('BackendLogCommunicationTransport', () => {
  describe('.log', () => {
    let backendLogComTransport, communication

    beforeEach(() => {
      communication = new FakeMainCommunication()
      backendLogComTransport = new BackendLogCommunicationTransport(communication)
    })

    it('sends messages via communication', () => {
      backendLogComTransport.log({level: 'error', message: 'error message'}, () => {
        expect(communication.wasInvoked(communication.sendMysterionBackendLog)).to.be.true
        expect(communication.getLastPayload(communication.sendMysterionBackendLog))
          .to.eql([{level: 'error', message: 'error message'}])
      })
    })

    it('sends any unknown log level to info', () => {
      backendLogComTransport.log({level: 'some level', message: 'random message'}, () => {
        expect(communication.wasInvoked(communication.sendMysterionBackendLog)).to.be.true
        expect(communication.getLastPayload(communication.sendMysterionBackendLog))
          .to.eql([{level: 'info', message: 'random message'}])
      })
    })
  })
})
