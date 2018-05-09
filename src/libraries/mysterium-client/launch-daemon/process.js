import {Tail} from 'tail'
import path from 'path'
import logLevels from '../log-levels'

/**
 * Spawns 'mysterium_client' daemon on OSX by calling TequilapiClient.healthcheck()
 */
class Process {
  /**
   * @constructor
   * @param {TequilapiClient} tequilapi - api to be used
   * @param {string} dataDir - directory where it's looking for logs
   */
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
    tailFile(this._getFileForLevel(level), cb)
  }

  async stop () {
    await this.tequilapi.stop()
    console.log('Client Quit was successful')
  }

  /**
   * Converts log level to log files 'stdout.log' or 'stderr.log'
   *
   * @param {string} level
   * @return {string}
   * @private
   */
  _getFileForLevel (level) {
    switch (level) {
      case logLevels.LOG:
        return path.join(this.dataDir, 'stdout.log')
      case logLevels.ERROR:
        return path.join(this.dataDir, 'stderr.log')
      default:
        throw new Error(`Unknown daemon logging level: ${level}`)
    }
  }
}

function tailFile (filePath, cb) {
  try {
    const logTail = new Tail(filePath)
    logTail.on('line', cb)
    logTail.on('error', cb)
  } catch (e) {
    console.error('log file watching failed. file probably doesn\'t exist: ' + filePath)
  }
}

export default Process
