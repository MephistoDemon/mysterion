// @flow
export interface Ipc {
  send (channel: string, ...args: Array<mixed>): void,
  on (channel: string, callback: Function): void
}
