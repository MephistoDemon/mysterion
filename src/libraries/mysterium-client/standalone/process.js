import {spawn} from 'child_process'
import logLevels from '../log-levels'

/**
 * 'mysterium_client' process handler
 */
class Process {
  /**
   * @constructor
   * @param {ClientConfig} config
   */
  constructor (config) {
    this.config = config
  }

  start () {
    this.child = spawn(this.config.clientBin, [
      '--config-dir', this.config.configDir,
      '--runtime-dir', this.config.runtimeDir,
      '--openvpn.binary', this.config.openVPNBin,
      '--tequilapi.port', this.config.tequilapiPort
    ])
  }

  stop () {
    this.child.kill('SIGTERM')
  }

  /**
   * Registers a callback for a specific process log/error message
   *
   * @param {string} level
   * @param {LogCallback} cb
   */
  onLog (level, cb) {
    this._getStreamForLevel(level).on('data', (data) => {
      cb(data.toString())
    })
  }

  /**
   * Converts log level to child process members 'child.stdout' and 'child.stderr'
   *
   * @param {string} level
   * @return {Readable}
   * @private
   */
  _getStreamForLevel (level) {
    switch (level) {
      case logLevels.LOG:
        return this.child.stdout
      case logLevels.ERROR:
        return this.child.stderr
      default:
        throw new Error(`Unknown logging level: ${level}`)
    }
  }
}

export default Process

/**
 * @callback LogCallback
 * @param {string} data - chunk of log output
 */
