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

import { exec } from 'child_process'
import sudo from 'sudo-prompt'
import { promisify } from 'util'
import fs from 'fs'

const writeFile = promisify(fs.writeFile)

interface System {
  userExec(command: string): Promise<string>,

  sudoExec(command: string): Promise<string>,

  writeFile(file: string, content: string): Promise<void>,

  readFile(file: string): string,

  fileExists(file: string): boolean
}

class OSSystem implements System {
  userExec (command: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        resolve(stdout.trim())
      })
    })
  }

  sudoExec (command: string): Promise<string> {
    return new Promise(function (resolve, reject) {
      sudo.exec(command, { name: 'Mysterion' }, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }

        resolve(stdout.trim())
      })
    })
  }

  async writeFile (file: string, contents: string): Promise<void> {
    await writeFile(file, contents)
  }

  readFile (file: string): string {
    return fs.readFileSync(file).toString()
  }

  fileExists (file: string) {
    return fs.existsSync(file)
  }
}

export default OSSystem
export type { System }
