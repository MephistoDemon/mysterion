import {ipcMain} from 'electron'

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

    ipcMain.on('renderer.booted', async (event) => {
      const notifyRenderer = () => {
        try {
          event.sender.send('healthcheck', this.clientIsRunning)
        } catch (e) {
        }

        this.ipcTimeout = setTimeout(() => notifyRenderer(), healthCheckInterval)
      }

      notifyRenderer()
    })
  }

  stop () {
    clearTimeout(this.apiTimeout)
    clearTimeout(this.ipcTimeout)
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
