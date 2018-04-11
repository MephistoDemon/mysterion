// @flow
import messages from './index'

interface IpcMain {
  on (channel: string, callback: Function): void
}

/**
 * This allows sending messages to ipcMain.
 */
class MainCommunication {
  _ipc: IpcMain

  constructor (ipc: IpcMain) {
    this._ipc = ipc
  }

  onConnectionStatusChange (callback: Function) {
    this._on(messages.CONNECTION_STATUS_CHANGED, callback)
  }

  _on (channel: string, callback: Function) {
    this._ipc.on(channel, (event, ...args) => {
      // eslint-disable-next-line
      callback(...args)
    })
  }
}

export default MainCommunication
