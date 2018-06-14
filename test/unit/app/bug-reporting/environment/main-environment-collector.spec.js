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
import MainEnvironmentCollector from '../../../../../src/app/bug-reporting/environment/main-environment-collector'
import LogCache from '../../../../../src/app/logging/log-cache'

describe('MainEnvironmentCollector', () => {
  const releaseID = 'id of release'
  let mysteriumProcessLogCache: LogCache
  let backendLogCache: LogCache
  let collector: MainEnvironmentCollector

  beforeEach(() => {
    mysteriumProcessLogCache = new LogCache()
    backendLogCache = new LogCache()
    collector = new MainEnvironmentCollector(backendLogCache, mysteriumProcessLogCache, releaseID)
  })

  describe('getMysterionReleaseId', () => {
    it('returns release id', () => {
      expect(collector.getMysterionReleaseId()).to.eql(releaseID)
    })
  })

  describe('getSessionId', () => {
    it('returns string', () => {
      expect(collector.getSessionId()).to.be.a('string')
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
