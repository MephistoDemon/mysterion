// @flow
export default class FakeIpc {
  lastChannel: ?string
  lastArgs: ?Array<mixed>

  constructor () {
    this.lastChannel = null
    this.lastArgs = null
  }

  send (channel: string, ...args: Array<mixed>) {
    this.lastChannel = channel
    this.lastArgs = args
  }

  clean () {
    this.lastChannel = null
    this.lastArgs = null
  }
}
