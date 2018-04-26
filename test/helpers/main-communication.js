// @flow

class FakeMainCommunication {
  sentConnect: boolean = false
  sentDisconnect: boolean = false

  sendConnectionRequest () {
    this.sentConnect = true
  }

  sendConnectionCancelRequest () {
    this.sentDisconnect = true
  }
}

export default FakeMainCommunication
