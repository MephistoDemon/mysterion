// @flow
import {ipcRenderer} from 'electron'

export default {
  send (channel: string, ...args: Array<mixed>) {
    ipcRenderer.send(channel, ...args)
  }
}
