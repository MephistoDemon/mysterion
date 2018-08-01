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

import { before, beforeEach, after, describe, expect, it } from '../../../helpers/dependencies'
import lolex from 'lolex'
import EmptyTequilapiClientMock from '../../renderer/store/modules/empty-tequilapi-client-mock'
import NodeBuildInfoDTO from '../../../../src/libraries/mysterium-tequilapi/dto/node-build-info'
import type { NodeHealthcheckDTO } from '../../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'
import Monitoring from '../../../../src/libraries/mysterium-client/monitoring'
import { nextTick } from '../../../helpers/utils'

class TequilapiMock extends EmptyTequilapiClientMock {
  cancelIsCalled: boolean = false
  healthCheckThrowsError: boolean = false
  healthCheckIsCalled: boolean = false

  async connectionCancel (): Promise<void> {
    this.cancelIsCalled = true
  }

  async healthCheck (_timeout: ?number): Promise<NodeHealthcheckDTO> {
    this.healthCheckIsCalled = true
    if (this.healthCheckThrowsError) {
      throw new Error('HEALTHCHECK_TEST_ERROR')
    }
    return {
      uptime: '',
      process: 0,
      version: '',
      buildInfo: new NodeBuildInfoDTO({})
    }
  }
}

describe('Monitoring', () => {
  let tequilapiClient: TequilapiMock
  let monitoring: Monitoring
  let clock: lolex

  async function tickWithDelay (duration) {
    clock.tick(duration)
    await nextTick()
  }

  before(() => {
    clock = lolex.install()
  })

  after(() => {
    clock.uninstall()
  })

  beforeEach(() => {
    tequilapiClient = new TequilapiMock()
    // $FlowFixMe
    monitoring = new Monitoring(tequilapiClient)
  })

  describe('.start', () => {
    it('makes healthCheck call', () => {
      expect(tequilapiClient.healthCheckIsCalled).to.be.false
      monitoring.start()
      expect(tequilapiClient.healthCheckIsCalled).to.be.true
    })
  })

  describe('.onStatus', () => {
    it('notifies about default status', () => {
      let lastStatus: ?boolean = null
      monitoring.onStatus(isRunning => {
        lastStatus = isRunning
      })
      expect(lastStatus).to.be.false
    })

    it('notifies when status changes', async () => {
      let lastStatus: ?boolean = null
      monitoring.onStatus(isRunning => {
        lastStatus = isRunning
      })
      monitoring.start()
      await nextTick()
      // by default tequilapi's mock healthCheck works without errors
      expect(lastStatus).to.be.true

      tequilapiClient.healthCheckThrowsError = true
      await tickWithDelay(2000)
      expect(lastStatus).to.be.false

      tequilapiClient.healthCheckThrowsError = false
      await tickWithDelay(2000)
      expect(lastStatus).to.be.true
    })
  })
})
