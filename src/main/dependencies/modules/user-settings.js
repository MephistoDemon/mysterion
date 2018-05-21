// @flow
import type {Container} from '../../../app/di'
import {loadSettings} from '../../../app/userSettings'
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
    'userSettings',
    ['userSettingsPath'],
    (userSettingsPath) => {
      let userSettings
      try {
        userSettings = loadSettings(userSettingsPath)
      } catch (e) {
        console.log(`Failing to load ${userSettingsPath}`)
        console.log(e)
      }
      return userSettings
    }
  )
}

export default bootstrap
