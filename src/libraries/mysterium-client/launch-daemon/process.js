class Process {
  constructor (tequilapi) {
    this.tequilapi = tequilapi
  }

  async start () {
    try {
      await this.tequilapi.healthCheck(100)
    } catch (e) {
      console.log('touched the daemon, now it should be up')
    }
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
