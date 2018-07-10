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

// TODO: rename file to log-cache.spec.js

import { describe, it, expect, beforeEach } from '../../../helpers/dependencies'
import LogCache from '../../../../src/app/logging/log-cache'
import { captureError } from '../../../helpers/utils'

describe('LogCache', () => {
  let logCache, error
  beforeEach(() => {
    logCache = new LogCache()
    error = new Error('err message')
    logCache.pushToLevel('info', 'something')
    logCache.pushToLevel('info', 'log2')
    logCache.pushToLevel('error', error)
  })

  describe('.pushToLevel', () => {
    it('throws error when pushing unknown level', () => {
      const unknownLevel = (('unknown': any): 'info')
      const err = captureError(() => logCache.pushToLevel(unknownLevel, 'log'))
      if (!err) {
        throw new Error('No error was returned')
      }
      expect(err.message).to.eql('Unknown log level being pushed to log cache: unknown')
    })
  })

  describe('.getSerialized', () => {
    it('serializes caches to string in reverse order', () => {
      expect(logCache.getSerialized().info).to.eql('log2\nsomething')
      expect(logCache.getSerialized().error).to.eql(error.toString())
    })
  })
})
