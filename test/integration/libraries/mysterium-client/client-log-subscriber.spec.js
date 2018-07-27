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

import type { LogCallback } from '../../../../src/libraries/mysterium-client'
import logLevels from '../../../../src/libraries/mysterium-client/log-levels'
import { afterEach, beforeEach, describe, expect, it } from '../../../helpers/dependencies'
import ClientLogSubscriber from '../../../../src/libraries/mysterium-client/client-log-subscriber'
import { existsSync, unlinkSync } from 'fs'
import path from 'path'
import { CallbackRecorder } from '../../../helpers/utils'

describe('ClientLogSubscriber', () => {
  let logCallbackParam = ''
  let subscriber
  const stdout = path.join(process.cwd(), __dirname, 'stdout.log')
  const stderr = path.join(process.cwd(), __dirname, 'stderr.log')
  const dateFunction = () => new Date('2018-01-01')
  const tailFunction = (path: string, logCallback: LogCallback) => {
    logCallback(logCallbackParam)
  }

  beforeEach(() => {
    subscriber = new ClientLogSubscriber(stdout, stderr, stdout, dateFunction, tailFunction)
  })

  afterEach(() => {
    unlinkSync(stdout)
    unlinkSync(stderr)
  })

  describe('.setup', () => {
    it('creates missing files', async () => {
      expect(existsSync(stdout)).to.be.false
      expect(existsSync(stderr)).to.be.false

      await subscriber.setup()

      expect(existsSync(stdout)).to.be.true
      expect(existsSync(stderr)).to.be.true
    })
  })

  describe('.onLog', () => {
    it('binds info level log callback', async () => {
      logCallbackParam = 'info line'

      const sub = new CallbackRecorder()
      subscriber.onLog(logLevels.INFO, sub.getCallback())

      await subscriber.setup()

      expect(sub.invoked).to.be.true
      expect(sub.arguments).to.be.eql([logCallbackParam])
    })

    it('binds error level log callback', async () => {
      logCallbackParam = 'error line'
      const sub = new CallbackRecorder()

      subscriber.onLog(logLevels.ERROR, sub.getCallback())

      await subscriber.setup()

      expect(sub.invoked).to.be.true
      expect(sub.arguments).to.be.eql(['2018-01-01T00:00:00.000Z error line'])
    })
  })
})
