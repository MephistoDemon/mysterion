import {Tail} from 'tail'

export const logLevel = {
  LOG: 'stdout',
  ERROR: 'stderr'
}

const stdFiles = {
  [logLevel.LOG]: 'stdout.log',
  [logLevel.ERROR]: 'stderr.log'
}

/**
 * Spawns mysterium_client daemon on OSX by calling tequilapi.healthcheck
 * @constructor
 * @param {Object} tequilapi - api to be used
 * @param {string} dataDir - directory where it's looking for logs
 */
class Process {
  constructor (tequilapi, dataDir) {
    this.tequilapi = tequilapi
    this.dataDir = dataDir
  }

  start () {
    this.tequilapi.healthCheck().catch(() => {
      console.log('touched the daemon, now it should be up')
    })
  }

  onLog (level, cb) {
    if (!stdFiles[level]) throw new Error(`Unknown daemon logging level: ${level}`)
    tailFile(this.dataDir + '/' + stdFiles[level], cb)
  }

  async stop () {
    await this.tequilapi.stop()
    console.log('Client Quit was successful')
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
