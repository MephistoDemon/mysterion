// @flow
import {readFile, writeFile} from 'fs'
import {promisify} from 'util'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

type UserSettingsDTO = {
  showDisconnectNotifications: boolean
}

export default class UserSettings {
  showDisconnectNotifications: boolean

  constructor (obj: UserSettingsDTO) {
    this.showDisconnectNotifications = obj.showDisconnectNotifications
  }
}

async function saveSettings (path: string, settings: UserSettings): Promise<?Error> {
  const settingsString = JSON.stringify(settings)
  await writeFileAsync(path, settingsString)
}

async function loadSettings (path: string): Promise<?UserSettings> {
  const data = await readFileAsync(path, {encoding: 'utf8'})
  const parsedSettings = JSON.parse(data)

  if (typeof parsedSettings.showDisconnectNotifications === 'boolean') {
    return new UserSettings(parsedSettings)
  }
}

export {saveSettings, loadSettings}
