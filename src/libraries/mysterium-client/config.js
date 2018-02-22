class Config {
  constructor (clientBin, configDir, openVPNBin, dataDir, runtimeDir, logDir) {
    this.clientBin = clientBin
    this.configDir = configDir
    this.dataDir = dataDir
    this.openVPNBin = openVPNBin
    this.runtimeDir = runtimeDir
    this.logDir = logDir
  }
}

export default Config
