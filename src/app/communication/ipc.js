// @flow
export interface Ipc {
  send (channel: string, data?: mixed): void,
  on (channel: string, callback: Function): void
}
