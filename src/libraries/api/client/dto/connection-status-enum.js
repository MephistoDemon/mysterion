// @flow

const ConnectionStatusEnum = {
  CONNECTED: 'Connected',
  NOT_CONNECTED: 'NotConnected',
  DISCONNECTING: 'Disconnecting',
  CONNECTING: 'Connecting'
}

type ConnectionStatus = 'Connected' | 'Connecting' | 'NotConnected' | 'Connecting'

export default ConnectionStatusEnum
export type {ConnectionStatus}
