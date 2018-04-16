// @flow
import {ipcRenderer} from 'electron'
import type {MessageBus} from './messageBus'

class RendererMessageBus implements MessageBus {
  send (channel: string, data?: mixed): void {
    ipcRenderer.send(channel, data)
  }
  on (channel: string, callback: Function): void {
    ipcRenderer.on(channel, callback)
  }
}

function buildRendererMessageBus (): RendererMessageBus {
  return new RendererMessageBus()
}

export default RendererMessageBus
export { buildRendererMessageBus }
