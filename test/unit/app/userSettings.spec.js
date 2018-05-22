// @flow
import UserSettings, {saveSettings, loadSettings} from '../../../src/app/userSettings'
import {describe, expect, it, after, before} from '../../helpers/dependencies'
import {tmpdir} from 'os'
import {join} from 'path'
import {readFileSync, writeFileSync, unlinkSync} from 'fs'
import {capturePromiseError} from '../../helpers/utils'

describe('User Settings storage', () => {
  const settingsPath = join(tmpdir(), 'settings.test.saving.json')
  const loadSettingsPath = join(tmpdir(), 'settings.test.loading.json')
  const invalidPath = join(tmpdir(), 'some', 'file')

  describe('saveSettings', () => {
    const userSettings = new UserSettings({showDisconnectNotifications: false})

    after(() => {
      unlinkSync(settingsPath)
    })

    it('exports a valid json on save()', async () => {
      await saveSettings(settingsPath, userSettings)
      const data = readFileSync(settingsPath, {encoding: 'utf8'})
      expect(data.toString()).to.eql('{"showDisconnectNotifications":false}')
    })

    it('throws error if saveSettings() fails on invalid path to file', async () => {
      const err = await capturePromiseError(
        saveSettings(invalidPath, new UserSettings({showDisconnectNotifications: false})))

      expect(err instanceof Error).to.be.true
    })
  })

  describe('loadSettings', () => {
    before(() => {
      writeFileSync(
        loadSettingsPath,
        JSON.stringify({showDisconnectNotifications: false})
      )
    })
    after(() => {
      unlinkSync(loadSettingsPath)
    })

    it('reads showDisconnectNotifications correctly from file', async () => {
      const loadedUserSettings = await loadSettings(loadSettingsPath)
      expect(loadedUserSettings.showDisconnectNotifications).to.be.false
    })

    it('throws error if loadSettings() fails on invalid path to file', async () => {
      const error = await capturePromiseError(loadSettings(invalidPath))
      expect(error instanceof Error).to.be.true
    })
  })
})
