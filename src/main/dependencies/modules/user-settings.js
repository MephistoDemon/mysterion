// @flow
import type {Container} from '../../../app/di'
import {UserSettingsStore} from '../../../app/userSettings'
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
    'userSettingsStore',
    ['userSettingsPath'],
    (userSettingsPath) => {
      const userSettings = new UserSettingsStore(userSettingsPath)
      return userSettings
    }
  )
}

export default bootstrap
