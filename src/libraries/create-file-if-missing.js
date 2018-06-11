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

import fs from 'fs'
import { promisify } from 'util'

const writeFile = promisify(fs.writeFile)
const openFile = promisify(fs.open)

const READ_FILE_OR_FAIL_IF_NOT_EXIST = 'r'

export default async function createFileIfMissing (path: string) {
  try {
    await openFile(path, READ_FILE_OR_FAIL_IF_NOT_EXIST)
  } catch (error) {
    if (error.code && error.code === 'ENOENT') {
      await writeFile(path, '')
      return
    }
    throw error
  }
}
