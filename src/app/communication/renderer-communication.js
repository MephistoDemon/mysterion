// @flow

import messages from './index'

interface IpcRenderer {
  send (channel: string, ...args: Array<mixed>): void,
  on (channel: string, callback: Function): void
}

/**
 * This allows receiving messages from ipc
 */
class RendererCommunication {
  _ipc: IpcRenderer

  constructor (ipc: IpcRenderer) {
    this._ipc = ipc
  }

  sendConnectionStatusChange (oldStatus: string, newStatus: string) {
    return this._send(messages.CONNECTION_STATUS_CHANGED, oldStatus, newStatus)
  }

  onMysteriumClientLog (callback: Function) {
    this._on(messages.MYSTERIUM_CLIENT_LOG, callback)
  }

  _send (channel: string, ...args: Array<mixed>) {
    this._ipc.send(channel, ...args)
  }

  _on (channel: string, callback: Function) {
    this._ipc.on(channel, (event, data) => {
      callback(data)
    })
  }
}

export default RendererCommunication
