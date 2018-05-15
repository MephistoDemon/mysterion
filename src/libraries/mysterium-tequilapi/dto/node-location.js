// @flow

class NodeLocationDTO {
  originalCountry: string
  originalIP: string
  currentCountry: string
  currentIP: string

  constructor (data: Object) {
    this.originalCountry = data.original.country
    this.originalIP = data.original.ip
    this.currentCountry = data.current.country
    this.currentIP = data.current.ip
  }
}

export default NodeLocationDTO
