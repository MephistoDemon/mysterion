// @flow
import {Notification} from 'electron'

export default class MystNotification {
  title: string
  subtitle: string
  isEnabled: boolean = true

  constructor (title: string, subtitle: string) {
    this.title = title
    this.subtitle = subtitle
  }

  enable () {
    this.isEnabled = true
  }

  disable () {
    this.isEnabled = false
  }

  show () {
    const electronNotification = new Notification({
      title: this.title,
      subtitle: this.subtitle
    })
    electronNotification.show()
  }
}
