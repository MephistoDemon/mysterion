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

import { before, describe, expect, it } from '../../helpers/dependencies'
import SyncCallbacksInitializer from '../../../src/app/sync-callbacks-initializer'
import type { EnvironmentCollector, LogCaches } from '../../../src/app/bug-reporting/environment/environment-collector'
import type { SyncMainCommunication } from '../../../src/app/communication/sync/sync-communication'
import type { LogDTO } from '../../../src/app/communication/dto'

class MockEnvironmentCollector implements EnvironmentCollector {
  mockSessionId = 'mock session id'
  mockMysterionReleaseId = 'mock mysterion release id'
  _cache = { info: 'mock info', error: 'mock error' }
  mockSerializedCaches = {
    backend: this._cache,
    frontend: this._cache,
    mysterium_process: this._cache
  }

  getSessionId () {
    return this.mockSessionId
  }

  getMysterionReleaseId () {
    return this.mockMysterionReleaseId
  }

  getSerializedCaches () {
    return this.mockSerializedCaches
  }
}

class MockCommunication implements SyncMainCommunication {
  getSession: () => string
  getSerializedCaches: () => LogCaches
  log: (log: LogDTO) => void

  onGetSessionId (callback: () => string): void {
    this.getSession = callback
  }

  onGetSerializedCaches (callback: () => LogCaches): void {
    this.getSerializedCaches = callback
  }

  onLog (callback: () => void): void {
    this.log = callback
  }
}

describe('SyncCallbacksInitializer', () => {
  let communication: MockCommunication
  let envCollector: MockEnvironmentCollector
  let initializer: SyncCallbacksInitializer

  before(() => {
    envCollector = new MockEnvironmentCollector()
    communication = new MockCommunication()
    initializer = new SyncCallbacksInitializer(communication, envCollector)
  })

  describe('.initialize', () => {
    it('registers handlers', () => {
      initializer.initialize()
      expect(communication.getSession()).to.eql(envCollector.mockSessionId)
      expect(communication.getSerializedCaches()).to.eql(envCollector.mockSerializedCaches)
      const logDto = { level: 'info', data: 'test log' }
      expect(communication.log(logDto)).to.be.undefined
    })
  })
})
