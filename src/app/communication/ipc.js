// @flow
export interface Ipc {
  send (channel: string, data?: mixed): void,
  on (channel: string, callback: (data?: mixed) => void): void
}
