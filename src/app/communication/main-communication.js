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
