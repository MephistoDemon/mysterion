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
import { readFile, writeFile } from 'fs'
import { promisify } from 'util'
import type { FavoriteProviders, UserSettings } from './user-settings'
import Subscriber from '../../libraries/subscriber'
import type { Callback } from '../../libraries/subscriber'

const readFileAsync = promisify(readFile)
const writeFileAsync = promisify(writeFile)

const userStoreSettingString = {
  showDisconnectNotifications: 'showDisconnectNotifications',
  favoriteProviders: 'favoriteProviders'
}

export type FavoriteProviderToggle = { id: string, isFavorite: boolean }

type UserStoreSetting = $Values<typeof userStoreSettingString>

class UserSettingsStore {
  _settings: UserSettings = {
    showDisconnectNotifications: true,
    favoriteProviders: new Set()
  }
  _path: string

  _listeners: {
    favoriteProviders: Subscriber<FavoriteProviders>,
    showDisconnectNotifications: Subscriber<boolean>
  } = {
    favoriteProviders: new Subscriber(),
    showDisconnectNotifications: new Subscriber()
  }

  constructor (path: string) {
    this._path = path
  }

  async load (): Promise<void> {
    let parsed
    try {
      parsed = await loadSettings(this._path)
    } catch (e) {
      if (isFileNotExistError(e)) {
        return
      }
      throw e
    }
    this._settings.favoriteProviders = new Set(parsed.favoriteProviders)
    this._settings.showDisconnectNotifications = parsed.showDisconnectNotifications
    this._notify(userStoreSettingString.favoriteProviders)
    this._notify(userStoreSettingString.showDisconnectNotifications)
  }

  async save (): Promise<void> {
    return saveSettings(this._path, this._settings)
  }

  setFavorite (id: string, isFavorite: boolean) {
    if (isFavorite === this._settings.favoriteProviders.has(id)) {
      return // nothing changed
    }

    if (isFavorite) this._settings.favoriteProviders.add(id)
    else this._settings.favoriteProviders.delete(id)
    this._notify(userStoreSettingString.favoriteProviders)
  }

  setShowDisconnectNotifications (show: boolean) {
    this._settings.showDisconnectNotifications = show
    this._notify(userStoreSettingString.showDisconnectNotifications)
  }

  getAll (): UserSettings {
    return this._settings
  }

  onChange (property: UserStoreSetting, cb: Callback<any>) {
    this._listeners[property].subscribe(cb)
  }

  _notify (propertyChanged: UserStoreSetting) {
    const newVal = ((this._settings[propertyChanged]): any)
    this._listeners[propertyChanged].notify(newVal)
  }
}

async function saveSettings (path: string, settings: UserSettings): Promise<void> {
  const settingsString = JSON.stringify(settings)
  await writeFileAsync(path, settingsString)
}

async function loadSettings (path: string): Promise<UserSettings> {
  let data = await readFileAsync(path, {encoding: 'utf8'})
  const parsedSettings = JSON.parse(data)

  if (!validateUserSettings(parsedSettings)) {
    throw new TypeError('UserSettings loading failed. Parsed Object is not of UserSettings type.')
  }

  return parsedSettings
}

function validateUserSettings (settings: Object): boolean {
  return (typeof settings.showDisconnectNotifications === 'boolean')
}

function isFileNotExistError (error: Object): boolean {
  return (error.code && error.code === 'ENOENT')
}

export { UserSettingsStore, userStoreSettingString }
