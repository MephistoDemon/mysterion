class Config {
  constructor (clientBin, configDir, dataDir, runtimeDir, logDir) {
    this.clientBin = clientBin
    this.configDir = configDir
    this.dataDir = dataDir
    this.runtimeDir = runtimeDir
    this.logDir = logDir
  }
}

export default Config
