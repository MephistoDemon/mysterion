// @flow
import {UserSettingsStore} from '../../../src/app/userSettings'
import {describe, expect, it, after, before} from '../../helpers/dependencies'
import {tmpdir} from 'os'
import {join} from 'path'
import {readFileSync, writeFileSync, unlinkSync} from 'fs'
import {capturePromiseError} from '../../helpers/utils'

describe('UserSettingsStore', () => {
  describe('save()', () => {
    const saveSettingsPath = join(tmpdir(), 'settings.test.saving.json')
    const invalidPath = join(tmpdir(), 'some', 'dir')

    after(() => {
      unlinkSync(saveSettingsPath)
    })

    it('exports a valid json on save()', async () => {
      const userSettingsStore = new UserSettingsStore(saveSettingsPath)
      userSettingsStore.set({showDisconnectNotifications: false})
      await userSettingsStore.save()
      const data = readFileSync(saveSettingsPath, {encoding: 'utf8'})

      expect(data.toString()).to.eql('{"showDisconnectNotifications":false}')
    })

    it('throws error if save() fails on invalid path to file', async () => {
      const userSettingsStore = new UserSettingsStore(invalidPath)
      userSettingsStore.set({showDisconnectNotifications: false})
      const err = await capturePromiseError(userSettingsStore.save())

      expect(err instanceof Error).to.be.true
    })
  })

  describe('load()', () => {
    const loadSettingsPath = join(tmpdir(), 'settings.test.loading.json')
    const invalidPath = join(tmpdir(), 'someother')
    const invalidJsonPath = join(tmpdir(), 'invalidjson')

    before(() => {
      writeFileSync(
        loadSettingsPath,
        JSON.stringify({showDisconnectNotifications: false})
      )
      writeFileSync(
        invalidJsonPath,
        'invalid Json content'
      )
    })
    after(() => {
      unlinkSync(loadSettingsPath)
      unlinkSync(invalidJsonPath)
    })

    it('reads showDisconnectNotifications from json file', async () => {
      const userSettingsStore = new UserSettingsStore(loadSettingsPath)
      await userSettingsStore.load()

      expect(userSettingsStore.settings).to.be.eql({showDisconnectNotifications: false})
    })

    it('throws error if load() fails on invalid path to file', async () => {
      const userSettingsStore = new UserSettingsStore(invalidPath)
      const error = await capturePromiseError(userSettingsStore.load())

      expect(error instanceof Error).to.be.true
    })

    it('throws on load() if invalid Json file is read', async () => {
      const userSettingsStore = new UserSettingsStore(invalidJsonPath)
      const error = await capturePromiseError(userSettingsStore.load())

      expect(error instanceof Error).to.be.true
    })
  })
})
