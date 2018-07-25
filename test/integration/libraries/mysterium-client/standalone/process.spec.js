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
import {ChildProcess} from 'child_process'
import sleep from '../../../../../src/libraries/sleep'
import Process from '../../../../../src/libraries/mysterium-client/standalone/standalone-client-process'
import Monitoring from '../../../../../src/libraries/mysterium-client/monitoring'
import processLogLevels from '../../../../../src/libraries/mysterium-client/log-levels'
import tequilapiClientFactory from '../../../../../src/libraries/mysterium-tequilapi/client-factory'
import {describe, xdescribe, it, before, after, expect} from '../../../../helpers/dependencies'
import path from 'path'
import os from 'os'

xdescribe('Standalone Process', () => {
  let process, tequilapi
  const logs = []
  const tequilapiPort = 4055
  const clientBinDirectory = path.resolve(__dirname, '../../../../../bin')
  const tmpDirectory = os.tmpdir()

  before(async () => {
    process = new Process({
      clientBin: path.join(clientBinDirectory, 'mysterium_client'),
      configDir: path.join(clientBinDirectory, 'config'),
      openVPNBin: path.join(clientBinDirectory, 'openvpn'),
      dataDir: tmpDirectory,
      runtimeDir: tmpDirectory,
      logDir: tmpDirectory,
      tequilapiPort: tequilapiPort,
      stdErrFileName: 'stderr.log',
      stdOutFileName: 'stdout.log',
      systemLogPath: '/tmp/logs/system.log'
    })
    process.start()
    process.onLog(processLogLevels.INFO, data => logs.push(data))

    tequilapi = tequilapiClientFactory(`http://127.0.0.1:${tequilapiPort}`)

    await sleep(100)
  })

  after(() => {
    process.stop()
  })

  describe('startup', () => {
    it('spawns in less than 100ms without errors', () => {
      expect(process._child).to.be.instanceOf(ChildProcess)
    })

    it('sends log data to callback on()', () => {
      expect(logs.pop()).to.include('Api started on: ' + tequilapiPort)
    })
  })

  describe('health checking', () => {
    it('response contains uptime and version', async () => {
      const res = await tequilapi.healthCheck()
      expect(res.uptime).to.be.ok
      expect(res.version).to.be.ok
    })

    it('responds to healthcheck with version string', async () => {
      const res = await tequilapi.healthCheck()
      expect(res.version).to.include.all.keys(['branch', 'commit', 'buildNumber'])
    })
  })

  describe('monitoring checking', () => {
    let processMonitoring
    before(async () => {
      processMonitoring = new Monitoring(tequilapi)
      processMonitoring.start()
    })

    after(() => {
      processMonitoring.stop()
    })

    it('sends status UP', (done) => {
      processMonitoring.onStatusUp(() => done())
    })
  })
})
