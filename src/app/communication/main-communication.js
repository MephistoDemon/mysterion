// @flow
import messages from './index'
import type {Ipc} from './ipc'
import type {ConnectionStatusChangeData, MysteriumClientLogData} from './dto'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _ipc: Ipc

  constructor (ipc: Ipc) {
    this._ipc = ipc
  }

  sendMysteriumClientLog (data: MysteriumClientLogData) {
    this._send(messages.MYSTERIUM_CLIENT_LOG, data)
  }

  onConnectionStatusChange (callback: (ConnectionStatusChangeData) => void) {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  _send (channel: string, data: mixed) {
    this._ipc.send(channel, data)
  }

  _on (channel: string, callback: (data: any) => void) {
    this._ipc.on(channel, (event, data) => {
      callback(data)
    })
  }
}

export default MainCommunication
