// @flow
import {ipcRenderer} from 'electron'

export default {
  send (channel: string, ...args: Array<mixed>) {
    ipcRenderer.send(channel, ...args)
  },
  on (channel: string, callback: Function) {
    ipcRenderer.on(channel, callback)
  }
}
