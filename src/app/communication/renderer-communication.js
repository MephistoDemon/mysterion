// @flow

import messages from './index'
import type {Ipc} from './ipc'

/**
 * This allows renderer process communicating with main process.
 */
class RendererCommunication {
  _ipc: Ipc

  constructor (ipc: Ipc) {
    this._ipc = ipc
  }

  sendConnectionStatusChange (oldStatus: string, newStatus: string) {
    return this._send(messages.CONNECTION_STATUS_CHANGED, oldStatus, newStatus)
  }

  onMysteriumClientLog (callback: (level: string, data: string) => void) {
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
