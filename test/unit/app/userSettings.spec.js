// @flow
import UserSettings from '../../../src/app/userSettings'
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
      userSettings.save()
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
      const loadedUserSettings = new UserSettings(loadSettingsPath)
      loadedUserSettings.load()
      expect(loadedUserSettings.showDisconnectNotifications).to.be.false
    })
  })

  describe.only('invalid path', () => {
    const userSettingsInvalidPath = new UserSettings(invalidPath)

    it('throws error on save()', () => {
      const error = captureError(userSettingsInvalidPath.save)
      expect(error instanceof Error).to.be.true
    })

    it('throws error on load()', () => {
      const error = captureError(userSettingsInvalidPath.load)
      console.log(error)
      expect(error instanceof TypeError).to.be.true
    })
  })
})
