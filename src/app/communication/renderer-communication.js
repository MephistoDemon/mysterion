// @flow

import messages from './index'

interface IpcRenderer {
  send (channel: string, ...args: Array<mixed>): void
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

  _send (channel: string, ...args: Array<mixed>) {
    this._ipc.send(channel, ...args)
  }
}

export default RendererCommunication
