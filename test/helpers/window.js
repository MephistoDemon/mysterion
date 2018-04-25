// @flow

class FakeWindow {
  isVisible: boolean = false
  devToolsOpen: boolean = false

  show () {
    this.isVisible = true
  }

  toggleDevTools () {
    this.devToolsOpen = !this.devToolsOpen
  }
}

export default FakeWindow
