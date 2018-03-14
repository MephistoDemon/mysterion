import {Tail} from 'tail'

const STD_OUT_FILE = 'stdout.log'
const STD_ERR_FILE = 'stderr.log'
/**
 * Spawns mysterium_client daemon on OSX by calling tequilapi.healthcheck
 * @constructor
 * @param {!Object} tequilapi - api to be used
 * @param {!string} dataDir - directory where it's looking for logs
 */
class Process {
  constructor (tequilapi, dataDir) {
    this.tequilapi = tequilapi
    this.dataDir = dataDir
  }

  start () {
    this.tequilapi.healthCheck(100).catch(() => {
      console.log('touched the daemon, now it should be up')
    })
  }

  onStdOut (cb) {
    tailFile(this.dataDir + '/' + STD_OUT_FILE, cb)
  }

  onStdErr (cb) {
    tailFile(this.dataDir + '/' + STD_ERR_FILE, cb)
  }

  async stop () {
    try {
      await this.tequilapi.stop()
      console.log('Client Quit was successful')
    } catch (err) {
      console.log('Error response while stopping client process:', err.message)
    }
  }
}

export default Process

function tailFile (filePath, cb) {
  try {
    const logTail = new Tail(filePath)
    logTail.on('line', cb)
    logTail.on('error', cb)
  } catch (e) {
    console.error('log file watching failed. file probably doesn\'t exist: ' + filePath)
  }
}
