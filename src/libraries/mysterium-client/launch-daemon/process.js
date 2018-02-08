class Process {
  constructor (config, tequilapi) {
    this.tequilapi = tequilapi
  }

  start () {
    // hack to spawn mysterium_client before the window is rendered
    this.tequilapi.healthCheck()
  }

  stop () {
    // TODO Implement kill here
  }
}

export default Process
