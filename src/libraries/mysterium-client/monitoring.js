const healthCheckInterval = 1500

class ProcessMonitoring {
  constructor (tequilApi) {
    this.api = tequilApi
    this.clientIsRunning = false
    this.apiTimeout = null
    this.ipcTimeout = null
  }

  start () {
    this._healthCheck()
  }

  stop () {
    clearTimeout(this.apiTimeout)
    clearTimeout(this.ipcTimeout)
  }

  isRunning () {
    return this.clientIsRunning
  }

  async _healthCheck () {
    try {
      await this.api.healthCheck(500)
      this.clientIsRunning = true
    } catch (e) {
      this.clientIsRunning = false
    }

    this.apiTimeout = setTimeout(() => {
      this._healthCheck()
    }, healthCheckInterval)
  }
}

export default ProcessMonitoring
