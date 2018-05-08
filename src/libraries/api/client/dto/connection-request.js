// @flow

class ConnectionRequestDTO {
  consumerId: string
  providerId: string

  constructor (consumerId: string, providerId: string) {
    this.consumerId = consumerId
    this.providerId = providerId
  }
}

export default ConnectionRequestDTO
