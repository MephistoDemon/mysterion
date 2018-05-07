// @flow

class NodeVersionDTO {
  commit: string
  branch: string
  buildNumber: string

  constructor (data: Object) {
    this.commit = data.commit
    this.branch = data.branch
    this.buildNumber = data.buildNumber
  }
}

export default NodeVersionDTO
