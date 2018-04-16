// @flow
export interface MessageBus {
  send (channel: string, data?: mixed): void,
  on (channel: string, callback: (data?: mixed) => void): void
}
