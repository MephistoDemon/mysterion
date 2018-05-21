// @flow
import {readFileSync, writeFileSync} from 'fs'

export default class UserSettings {
  showDisconnectNotifications: boolean

  constructor (obj: { showDisconnectNotifications: boolean }) {
    this.showDisconnectNotifications = obj.showDisconnectNotifications
  }
}

function saveSettings (path: string, settings: UserSettings) {
  const settingsString = JSON.stringify(settings)
  writeFileSync(path, settingsString)
}

function loadSettings (path: string): UserSettings {
  const data = readFileSync(path, {encoding: 'utf8'})
  if (data !== 'undefined') {
    return new UserSettings(JSON.parse(data))
  }
  return new UserSettings({showDisconnectNotifications: true})
}

export {saveSettings, loadSettings}
