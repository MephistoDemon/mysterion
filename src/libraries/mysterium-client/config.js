class ClientConfig {
  /**
   * @param {string} clientBin 'mysterium_client' binary path
   * @param {string} configDir 'mysterium_client' configuration files directory e.g. openvpn DNS resolver script
   * @param {string} openVPNBin 'openvpn' binary path
   * @param {string} dataDir User data directory for 'mysterium_client' data, etc.
   * @param {string} runtimeDir Runtime/working directory, used for storing temp files
   * @param {string} logDir Directory to store 'mysterium_client' logs
   */
  constructor (clientBin, configDir, openVPNBin, dataDir, runtimeDir, logDir) {
    this.clientBin = clientBin
    this.configDir = configDir
    this.dataDir = dataDir
    this.openVPNBin = openVPNBin
    this.runtimeDir = runtimeDir
    this.logDir = logDir
  }
}

export default ClientConfig
