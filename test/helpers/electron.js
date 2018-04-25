// @flow

class FakeApp {
  didQuit: boolean = false

  quit () {
    this.didQuit = true
  }
}

export default FakeApp
