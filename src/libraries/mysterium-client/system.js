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

type Command = {
  path: string,
  args?: string[]
}

const COMMANDS_SEPARATOR = ' && '

const stringifyCommand = (command: Command) => {
  let commandString = command.path
  if (command.path.includes(' ') || command.path.includes('/')) {
    commandString = `"${command.path}"`
  }
  if (command.args && command.args.length) {
    commandString += ' ' + command.args.join(' ')
  }
  return commandString
}

const stringifyCommands = (commands: Command[]) => {
  return commands
    .map(stringifyCommand)
    .join(COMMANDS_SEPARATOR)
}

interface System {
  userExec(...commands: Command[]): Promise<string>,

  sudoExec(...commands: Command[]): Promise<string>,

  writeFile(file: string, content: string): Promise<void>,

  readFile(file: string): string,

  fileExists(file: string): boolean
}

class OSSystem implements System {
  async userExec (...commands: Command[]): Promise<string> {
    return this._userExec(stringifyCommands(commands))
  }

  async sudoExec (...commands: Command[]): Promise<string> {
    return this._sudoExec(stringifyCommands(commands))
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

  _userExec (command: string): Promise<string> {
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

  _sudoExec (command: string): Promise<string> {
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
}

export default OSSystem
export { stringifyCommands }
export type { System, Command }
