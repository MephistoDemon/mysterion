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

  sendConnectionStatusChange (data: ConnectionStatusChangeData) {
    return this._send(messages.CONNECTION_STATUS_CHANGED, data)
  }

  onMysteriumClientLog (callback: (MysteriumClientLogData) => void) {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  _send (channel: string, ...args: Array<mixed>) {
    this._ipc.send(channel, ...args)
  }

  _on (channel: string, callback: Function) {
    this._ipc.on(channel, (event, ...args) => {
      // eslint-disable-next-line standard/no-callback-literal
      callback(...args)
    })
  }
}

export default RendererCommunication
