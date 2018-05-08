// @flow

class ConnectionStatisticsDTO {
  duration: number
  bytesReceived: number
  bytesSent: number

  constructor (data: Object) {
    this.duration = data.duration
    this.bytesReceived = data.bytesReceived
    this.bytesSent = data.bytesSent
  }
}

export default ConnectionStatisticsDTO
