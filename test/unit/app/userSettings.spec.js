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
