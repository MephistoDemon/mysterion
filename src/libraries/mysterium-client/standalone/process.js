import {spawn} from 'child_process'

// these constants correspond to child process members
// child.stdout and child.stderr
export const logLevel = {LOG: 'stdout', ERROR: 'stderr'}

class Process {
  /**
   * Creates mysterium_client process handler
   * @constructor
   * @param {{clientBinaryPath,openVPNBinary,clientConfigPath,runtimeDirectory: string}} config
   */
  constructor (config) {
    this.config = config
  }

  start (port = 4050) {
    this.child = spawn(this.config.clientBinaryPath, [
      '--config-dir', this.config.clientConfigPath,
      '--runtime-dir', this.config.runtimeDirectory,
      '--openvpn.binary', this.config.openVPNBinary,
      '--tequilapi.port', port
    ])
  }

  stop () {
    this.child.kill('SIGTERM')
  }

  /**
   * Registers a callback for a specific process log/error message
   * @param {string} level
   * @param {LogCallback} cb
   */
  onLog (level, cb) {
    if (!Object.values(logLevel).includes(level) || !this.child[level]) {
      throw new Error(`Unknown logging level: ${level}`)
    }
    this.child[level].on('data', (data) => {
      cb(data.toString())
    })
  }
}

export default Process

/**
 * @callback LogCallback
 * @param {string} data - chunk of log output
 */
