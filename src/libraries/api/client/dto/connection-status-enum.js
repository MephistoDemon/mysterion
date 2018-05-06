// @flow

const ConnectionStatusEnum = {
  CONNECTED: 'Connected',
  NOT_CONNECTED: 'NotConnected',
  DISCONNECTING: 'Disconnecting',
  CONNECTING: 'Connecting'
}

type ConnectionStatus = (
  typeof ConnectionStatusEnum.CONNECTED
  | typeof ConnectionStatusEnum.CONNECTING
  | typeof ConnectionStatusEnum.NOT_CONNECTED
  | typeof ConnectionStatusEnum.DISCONNECTING
)

export type {ConnectionStatus}
export default ConnectionStatusEnum
