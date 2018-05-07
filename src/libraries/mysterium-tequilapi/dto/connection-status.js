// @flow
import type {ConnectionStatus} from './connection-status-enum'

class ConnectionStatusDTO {
  status: ConnectionStatus
  sessionId: string

  constructor (data: Object) {
    this.status = data.status
    this.sessionId = data.sessionId
  }
}

export default ConnectionStatusDTO
