// @flow
import {readFileSync, writeFileSync} from 'fs'
import type {BugReporter} from './bug-reporting/interface'

export default class UserSettings {
  showDisconnectNotifications: boolean = true
  userSettingsJsonPath: string
  bugReporter: BugReporter

  constructor (userSettingsJsonPath, bugReporter) {
    this.userSettingsJsonPath = userSettingsJsonPath
    this.bugReporter = bugReporter
  }

  save () {
    const {showDisconnectNotifications} = this
    const settingsString = JSON.stringify({showDisconnectNotifications})
    writeFileSync(this.userSettingsJsonPath, settingsString)
  }

  load () {
    const data = readFileSync(this.userSettingsJsonPath, {encoding: 'utf8'})
    const parsed = JSON.parse(data)
    this.showDisconnectNotifications = parsed.showDisconnectNotifications
  }
}
