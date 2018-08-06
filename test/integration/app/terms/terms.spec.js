/*
 * Copyright (C) 2017 The "MysteriumNetwork/mysterion" Authors.
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

import Terms, { termsFileName } from '../../../../src/app/terms/index'
import fs from 'fs'
import path from 'path'
import util from 'util'
import dir from '../../../helpers/directory'

const unlinkAsync = util.promisify(fs.unlink)
const rmDirAsync = util.promisify(fs.rmdir)

const mockDir = './test/mock/terms'
const termsSrcDir = './static/terms'

describe('Terms', () => {
  const terms = new Terms(termsSrcDir, mockDir)
  terms.load()

  before(() => {
    dir.make(mockDir)
  })

  after(async () => {
    await unlinkAsync(path.join(mockDir, termsFileName))
    await rmDirAsync(mockDir)
  })

  it('can save terms html to destination folder', () => {
    terms.accept()
    expect(terms.isAccepted()).to.be.true
    expect(fs.existsSync(path.join(mockDir, termsFileName))).to.be.true
  })

  it('validates version of accepted terms', () => {
    fs.writeFileSync(terms._getExportedTermsPath(), 'fake terms')
    expect(terms.isAccepted()).to.be.false
  })
})
