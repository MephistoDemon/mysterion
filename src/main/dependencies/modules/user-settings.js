// @flow
import type {Container} from '../../../app/di'
import UserSettings, {loadSettings} from '../../../app/userSettings'
import {join} from 'path'

const userSettingsFilename = 'userSettings.json'

function bootstrap (container: Container) {
  container.factory(
    'userSettingsPath',
    ['mysterionApplication.config'],
    (mysterionConfig) => {
      return join(mysterionConfig.userDataDirectory, userSettingsFilename)
    }
  )

  container.factory(
    'userSettingsPromise',
    ['userSettingsPath'],
    async (userSettingsPath) => {
      try {
        return await loadSettings(userSettingsPath)
      } catch (e) {
        console.log(`Failing to load ${userSettingsPath}`)
        console.log(e)
        return new UserSettings({showDisconnectNotifications: true})
      }
    }
  )
}

export default bootstrap
