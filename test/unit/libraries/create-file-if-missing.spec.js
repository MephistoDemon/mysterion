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

import { after, describe, it, expect, before } from '../../helpers/dependencies'
import createFileIfMissing from '../../../src/libraries/create-file-if-missing'
import { unlinkSync, existsSync, writeFile, readFile } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { promisify } from 'util'

const readFilePromised = promisify(readFile)
const writeFilePromised = promisify(writeFile)

describe('createFileIfMissing', () => {
  const createFilePath = join(tmpdir(), 'createFileIfExists.test')
  const existingFilePath = join(tmpdir(), 'existingFile.test')

  before(async () => {
    await writeFilePromised(existingFilePath, 'some data')
  })

  after(() => {
    unlinkSync(createFilePath)
    unlinkSync(existingFilePath)
  })

  it('creates file if it doesn\'t exits', async () => {
    await createFileIfMissing(createFilePath)
    expect(existsSync(createFilePath)).to.be.true
  })

  it('doesn\'t overwrite file if it exists', async () => {
    await createFileIfMissing(existingFilePath)
    const existingFileContent = await readFilePromised(existingFilePath, { encoding: 'utf8' })
    expect(existingFileContent).to.eql('some data')
  })
})
