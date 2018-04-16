// @flow
import messages from './index'
import type {Ipc} from './ipc'
import type {ConnectionStatusChangeData, MysteriumClientLogData} from './dto'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _ipc: Ipc

  constructor (ipc: Ipc) {
    this._ipc = ipc
  }

  // TODO: remaining other messages

  sendConnectionStatusChange (data: ConnectionStatusChangeData) {
    return this._send(messages.CONNECTION_STATUS_CHANGED, data)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogData) => void) {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
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

export default RendererCommunication
