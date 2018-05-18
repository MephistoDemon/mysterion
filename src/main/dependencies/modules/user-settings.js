// @flow
import type {Container} from '../../../app/di'
import UserSettings from '../../../app/userSettings'
import {join} from 'path'

const userSettingsFilename = 'userSettings.json'

function bootstrap (container: Container) {
  container.factory(
    'userSettings',
    ['mysterionApplication.config'],
    (mysterionConfig) => {
      const userSettingsFilePath = join(mysterionConfig.userDataDirectory, userSettingsFilename)
      const userSettings = new UserSettings(userSettingsFilePath)
      try {
        userSettings.load()
      } catch (e) {
        console.log(`Failing to load ${userSettingsFilePath}`)
      }
      return userSettings
    })
}

export default bootstrap
