// @flow

const ConnectionStatusEnum = {
  CONNECTED: 'Connected',
  NOT_CONNECTED: 'NotConnected',
  DISCONNECTING: 'Disconnecting',
  CONNECTING: 'Connecting'
}

type ConnectionStatus = 'Connected' | 'NotConnected' | 'Disconnecting' | 'Connecting'

export default ConnectionStatusEnum
export type {ConnectionStatus}
