// @flow
import {ipcRenderer} from 'electron'
import type {Ipc} from './ipc'

class IpcRenderer implements Ipc {
  send (channel: string, ...args: Array<mixed>) {
    ipcRenderer.send(channel, ...args)
  }
  on (channel: string, callback: Function) {
    ipcRenderer.on(channel, callback)
  }
}

function buildIpcRenderer (): IpcRenderer {
  return new IpcRenderer()
}

export default IpcRenderer
export { buildIpcRenderer }
