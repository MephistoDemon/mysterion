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

import { beforeEach, describe, expect, it } from '../../../../helpers/dependencies'
import LogCache from '../../../../../src/app/logging/log-cache'
import RendererEnvironmentCollector
  from '../../../../../src/app/bug-reporting/environment/renderer-environment-collector'
import type { SyncRendererCommunication } from '../../../../../src/app/communication/sync/sync-communication'

class FakeSyncRendererCommunication implements SyncRendererCommunication {
  getSessionId (): ?string {
    return 'mock session id'
  }
}

describe('RendererEnvironmentCollector', () => {
  const releaseID = 'id of release'
  let mysteriumProcessLogCache: LogCache
  let backendLogCache: LogCache
  let collector: RendererEnvironmentCollector

  beforeEach(() => {
    mysteriumProcessLogCache = new LogCache()
    backendLogCache = new LogCache()
    const communication = new FakeSyncRendererCommunication()
    collector = new RendererEnvironmentCollector(backendLogCache, mysteriumProcessLogCache, releaseID, communication)
  })

  describe('getMysterionReleaseId', () => {
    it('returns release id', () => {
      expect(collector.getMysterionReleaseId()).to.eql(releaseID)
    })
  })

  describe('getSessionId', () => {
    it('returns session id using sync communication', () => {
      expect(collector.getSessionId()).to.eql('mock session id')
    })
  })

  describe('getSerializedMysteriumProcessLogCache', () => {
    it('returns logs from cache', () => {
      mysteriumProcessLogCache.pushToLevel('info', 'info value')
      mysteriumProcessLogCache.pushToLevel('error', 'error value')

      expect(collector.getSerializedMysteriumProcessLogCache()).to.eql({
        info: 'info value',
        error: 'error value'
      })
    })
  })

  describe('getSerializedBackendLogCache', () => {
    it('returns logs from cache', () => {
      backendLogCache.pushToLevel('info', 'info value')
      backendLogCache.pushToLevel('error', 'error value')

      expect(collector.getSerializedBackendLogCache()).to.eql({
        info: 'info value',
        error: 'error value'
      })
    })
  })
})
