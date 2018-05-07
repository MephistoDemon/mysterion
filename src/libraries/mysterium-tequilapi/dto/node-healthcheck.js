// @flow
import NodeVersionDTO from './node-version'

class NodeHealthcheckDTO {
  uptime: string
  process: number
  version: NodeVersionDTO

  constructor (data: Object) {
    this.uptime = data.uptime
    this.process = data.process
    if (data.version) {
      this.version = new NodeVersionDTO(data.version)
    }
  }
}

export default NodeHealthcheckDTO
