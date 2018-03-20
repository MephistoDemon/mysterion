/* eslint-disable no-unused-expressions */
import Process, {logLevel} from '../../../../../../src/libraries/mysterium-client/standalone/process'
// eslint-disable-next-line import/no-webpack-loader-syntax
import configInjector from 'inject-loader!../../../../../../src/app/mysterion-config'
import {ChildProcess} from 'child_process'
import delay from '../../../../../../src/libraries/sleep'
import tequilAPI from '../../../../../../src/libraries/api/tequilapi'

const config = configInjector({
  'electron': {
    app: {
      getPath () {
        return './test/mocks'
      },
      getAppPath () {
        return './src/main/'
      }
    }
  }
}).default

describe('Standalone Process', () => {
  let process, tequilapi
  const logs = []
  const port = 4055
  before(async () => {
    tequilapi = tequilAPI(`http://127.0.0.1:${port}`)
    process = new Process(config)
    process.start(port)
    process.on(logLevel.LOG, data => logs.push(data))
    await delay(500)
  })

  after(() => {
    process.stop()
  })

  it('spawns in less than 500ms without errors', () => {
    expect(process.child).to.be.instanceOf(ChildProcess)
  })

  it('sends log data to callback on()', () => {
    expect(logs.pop()).to.include('Api started on: ' + port)
  })

  it('responds to healthcheck with uptime', async () => {
    const res = await tequilapi.healthCheck()
    expect(res.uptime).to.be.ok
    expect(res.version).to.be.ok
  })

  it('responds to healthcheck with version string', async () => {
    const res = await tequilapi.healthCheck()
    expect(res.version).to.include.all.keys(['branch', 'commit', 'buildNumber'])
  })
})
