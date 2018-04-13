// @flow
import messages from './index'
import type {Ipc} from './ipc'

/**
 * This allows main process communicating with renderer process.
 */
class MainCommunication {
  _ipc: Ipc

  constructor (ipc: Ipc) {
    this._ipc = ipc
  }

  sendMysteriumClientLog (level: string, data: string) {
    this._send(messages.MYSTERIUM_CLIENT_LOG, level, data)
  }

  onConnectionStatusChange (callback: (oldStatus: string, newStatus: string) => void) {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
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

export default MainCommunication
