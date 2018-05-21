// @flow
import UserSettings, {saveSettings, loadSettings} from '../../../src/app/userSettings'
import {describe, expect, it, after} from '../../helpers/dependencies'
import {tmpdir} from 'os'
import {join} from 'path'
import {readFileSync, writeFileSync, unlinkSync} from 'fs'
import {captureError} from '../../helpers/utils'

describe('UserSettings', () => {
  const settingsPath = join(tmpdir(), 'settings.test.saving.json')
  const loadSettingsPath = join(tmpdir(), 'settings.test.loading.json')
  const invalidPath = join(tmpdir(), 'some')

  describe('saves settings', () => {
    const userSettings = new UserSettings(settingsPath)
    userSettings.showDisconnectNotifications = false

    after(() => {
      unlinkSync(settingsPath)
    })

    it('exports a valid json on save()', () => {
      saveSettings(settingsPath, userSettings)
      const data = readFileSync(settingsPath, {encoding: 'utf8'})
      expect(data.toString()).to.eql('{"showDisconnectNotifications":false}')
    })
  })

  describe('loads settings from file', () => {
    before(() => {
      writeFileSync(
        loadSettingsPath,
        JSON.stringify({showDisconnectNotifications: false})
      )
    })
    after(() => {
      unlinkSync(loadSettingsPath)
    })

    it('reads showDiscinnectNotifications correctly from file', () => {
      const loadedObject = loadSettings(loadSettingsPath)
      const loadedUserSettings = new UserSettings(loadedObject)
      expect(loadedUserSettings.showDisconnectNotifications).to.be.false
    })
  })

  describe('invalid path', () => {
    it('throws error on save()', () => {
      const error = captureError(saveSettings(invalidPath, new UserSettings({showDisconnectNotifications: false})))
      expect(error instanceof Error).to.be.true
    })

    it('throws error on load()', () => {
      const error = captureError(loadSettings(invalidPath))
      expect(error instanceof TypeError).to.be.true
    })
  })
})
