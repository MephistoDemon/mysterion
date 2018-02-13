class Process {
  constructor (config, tequilapi) {
    this.tequilapi = tequilapi
  }

  start () {
    return this.tequilapi.healthCheck(100)
  }

  async stop () {
    try {
      await this.tequilapi.stop()
      console.log('Client Quit was successful')
    } catch (err) {
      console.log('Error response while stopping client process:', err.message)
    }
  }
}

export default Process
