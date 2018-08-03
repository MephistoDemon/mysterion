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
import WinstonTransportCaching from '../../../../src/app/logging/winston-transport-caching'
import LogCache from '../../../../src/app/logging/log-cache'

describe('WinstonTransportCaching', () => {
  describe('.log', () => {
    let backendCachingTransport, logCache
    beforeEach(() => {
      logCache = new LogCache()
      backendCachingTransport = new WinstonTransportCaching(logCache)
    })

    it('adds data to error log cache', (done) => {
      backendCachingTransport.log({ level: 'error', message: 'text', timestamp: '<time>' }, () => {
        expect(logCache.get().error).to.be.eql(['<time>text'])
        done()
      })
    })

    it('adds data to info log cache for log levels (info, warn, debug)', (done) => {
      backendCachingTransport.log({ level: 'info', message: 'INFO', timestamp: '<time>' }, () => {
        backendCachingTransport.log({ level: 'warn', message: 'WARNING', timestamp: '<time>' }, () => {
          backendCachingTransport.log({ level: 'debug', message: 'DEBUG', timestamp: '<time>' }, () => {
            expect(logCache.get().info).to.be.eql(['<time>INFO', '<time>WARNING', '<time>DEBUG'])
            done()
          })
        })
      })
    })
  })
})
