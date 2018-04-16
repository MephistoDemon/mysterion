// @flow
import {ipcRenderer} from 'electron'
import type {Ipc} from './ipc'

class IpcRenderer implements Ipc {
  send (channel: string, data?: mixed): void {
    ipcRenderer.send(channel, data)
  }
  on (channel: string, callback: Function): void {
    ipcRenderer.on(channel, callback)
  }
}

function buildIpcRenderer (): IpcRenderer {
  return new IpcRenderer()
}

export default IpcRenderer
export { buildIpcRenderer }
