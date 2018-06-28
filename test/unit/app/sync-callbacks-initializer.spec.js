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
import type { EnvironmentCollector } from '../../../src/app/bug-reporting/environment/environment-collector'
import type { SyncMainCommunication } from '../../../src/app/communication/sync/sync-communication'
import type { LogDTO } from '../../../src/app/communication/dto'
import LogCache from '../../../src/app/logging/log-cache'
import type { SerializedLogCaches } from '../../../src/app/logging/log-cache-bundle'
import type { RavenData } from '../../../src/app/bug-reporting/bug-reporter-metrics'
import { TAGS } from '../../../src/app/bug-reporting/bug-reporter-metrics'

class MockEnvironmentCollector implements EnvironmentCollector {
  mockSessionId = 'mock session id'
  mockMysterionReleaseId = 'mock mysterion release id'
  _cache = { info: 'mock info', error: 'mock error' }
  mockSerializedCaches = {
    backend: this._cache,
    frontend: this._cache,
    mysterium_process: this._cache
  }
  mockMetrics = {
    tags: { [TAGS.CLIENT_RUNNING]: true },
    extra: {}
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

  getMetrics () {
    return this.mockMetrics
  }
}

class MockCommunication implements SyncMainCommunication {
  getSessionCallback: () => string
  getSerializedCachesCallback: () => SerializedLogCaches
  getMetricsCallback: () => RavenData
  logCallback: (log: LogDTO) => void

  onGetSessionId (callback: () => string): void {
    this.getSessionCallback = callback
  }

  onGetSerializedCaches (callback: () => SerializedLogCaches): void {
    this.getSerializedCachesCallback = callback
  }

  onGetMetrics (callback: () => RavenData): void {
    this.getMetricsCallback = callback
  }

  onLog (callback: () => void): void {
    this.logCallback = callback
  }
}

describe('SyncCallbacksInitializer', () => {
  let communication: MockCommunication
  let envCollector: MockEnvironmentCollector
  let logCache: LogCache
  let initializer: SyncCallbacksInitializer

  before(() => {
    communication = new MockCommunication()
    envCollector = new MockEnvironmentCollector()
    logCache = new LogCache()
    initializer = new SyncCallbacksInitializer(communication, envCollector, logCache)
  })

  describe('.initialize', () => {
    it('registers environment handlers', () => {
      initializer.initialize()

      expect(communication.getSessionCallback()).to.eql(envCollector.mockSessionId)
      expect(communication.getSerializedCachesCallback()).to.eql(envCollector.mockSerializedCaches)
      expect(communication.getMetricsCallback()).to.eql(envCollector.mockMetrics)
    })

    it('registers log handler', () => {
      initializer.initialize()

      communication.logCallback({ level: 'info', data: 'test info' })
      communication.logCallback({ level: 'error', data: 'test error' })
      expect(logCache.getSerialized()).to.eql({info: 'test info', error: 'test error'})
    })
  })
})
