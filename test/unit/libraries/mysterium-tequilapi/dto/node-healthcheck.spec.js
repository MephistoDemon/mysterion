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

import {expect} from 'chai'
import NodeHealthcheckDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-healthcheck'
import NodeBuildInfoDTO from '../../../../../src/libraries/mysterium-tequilapi/dto/node-build-info'
import { captureError } from '../../../../helpers/utils'

describe('TequilapiClient DTO', () => {
  describe('NodeHealthcheckDTO', () => {
    it('sets properties', async () => {
      const status = new NodeHealthcheckDTO({
        uptime: '1h10m',
        process: 1111,
        version: '0.0.6',
        buildInfo: {}
      })

      expect(status.uptime).to.equal('1h10m')
      expect(status.process).to.equal(1111)
      expect(status.version).to.equal('0.0.6')
      expect(status.buildInfo).to.deep.equal(new NodeBuildInfoDTO({}))
    })

    it('throws error with empty data', async () => {
      const err = captureError(() => new NodeHealthcheckDTO({}))
      expect(err).to.be.an('error')
      expect(err.message).to.eql('Unable to parse response')
    })

    it('throws error with wrong data', async () => {
      const err = captureError(() => new NodeHealthcheckDTO('I am wrong'))
      expect(err).to.be.an('error')
      expect(err.message).to.eql('Unable to parse response')
    })
  })
})
