import {spawn} from 'child_process'

class Process {
  constructor (config, tequilapi) {
    this.config = config
  }

  start () {
    spawn(this.config.clientBin, [
      '-runtime-dir', this.config.runtimeDir
    ])
  }
}

export default Process
