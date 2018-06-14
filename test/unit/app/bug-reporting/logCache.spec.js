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
import LogCache from '../../../../src/app/bug-reporting/log-cache'

describe('LogCache', () => {
  let logCache, error
  beforeEach(() => {
    logCache = new LogCache()
    error = new Error('err message')
    logCache.pushToCache('info', 'something')
    logCache.pushToCache('info', 'log2')
    logCache.pushToCache('error', error)
  })

  describe('.getLogCache', () => {
    it('returns what was pushed', () => {
      expect(logCache.getLogCache().info).to.eql(['something', 'log2'])
      expect(logCache.getLogCache().error).to.eql([error])
    })
  })

  describe('.serializeAllLogs', () => {
    it('serializes caches to string in reverse order', () => {
      expect(logCache.serializeAllLogs().info).to.eql('log2\nsomething')
      expect(logCache.serializeAllLogs().error).to.eql(error.toString())
    })
  })
})
