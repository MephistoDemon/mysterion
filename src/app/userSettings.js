/*
 * Copyright (C) 2018 The "MysteriumNetwork/mysterion" Authors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// @flow
import {readFile, writeFile} from 'fs'
import {promisify} from 'util'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

type UserSettingsDTO = {
  showDisconnectNotifications: boolean
}

class UserSettings {
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

class UserSettingsStore {
  settings: ?UserSettings
  _path: string
  constructor (path: string) {
    this._path = path
  }

  async load (): Promise<?UserSettings> {
    this.settings = await loadSettings(this._path)
    return this.settings
  }

  async save (): Promise<?Error> {
    if (!this.settings) throw new Error('Trying to save UserSettings, but UserSettingsStore.settings is missing')
    return saveSettings(this._path, this.settings)
  }

  set (settings: UserSettingsDTO) {
    this.settings = new UserSettings(settings)
  }
}

export {UserSettings, UserSettingsStore}
export type {UserSettingsDTO}
