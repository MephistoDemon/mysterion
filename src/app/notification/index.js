// @flow
import {Notification as NativeNotification} from 'electron'

export default class Notification {
  _title: string
  _subtitle: string

  constructor (title: string, subtitle: string) {
    this._title = title
    this._subtitle = subtitle
  }

  show () {
    const electronNotification = new NativeNotification({
      title: this._title,
      subtitle: this._subtitle
    })
    electronNotification.show()
  }
}
