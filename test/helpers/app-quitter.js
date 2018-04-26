// @flow

class ApplicationQuitter {
  didQuit: boolean = false

  quit () {
    this.didQuit = true
  }
}

export default ApplicationQuitter
