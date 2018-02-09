class Process {
  constructor (config, tequilapi) {
    this.tequilapi = tequilapi
  }

  start () {
    // hack to spawn mysterium_client before the window is rendered
    this.tequilapi.healthCheck()
  }

  async stop () {
    try {
      await this.tequilapi.stop()
    } catch (err) {
      console.log('Error response while stopping client process:', err)
    }
  }
}

export default Process
