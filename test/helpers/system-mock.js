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

// @flow

import type { System } from '../../src/libraries/mysterium-client/system'

export interface SystemMockManager {
  writeFileReturnValue: ?string,
  userExecCalledCommands: Array<string>,
  sudoExecCalledCommands: Array<string>,
  grantSudoPermissions: boolean,

  setMockFile (path: string, content: string): void,
  unsetMockFile (path: string): void,

  setMockCommand (command: string, response: string): void,
  unsetMockCommand (command: string): void,

  setMockCommandError (command: string, error: mixed): void
}

export default class SystemMock implements System, SystemMockManager {
  writeFileReturnValue: ?string = null
  userExecCalledCommands: string[] = []
  sudoExecCalledCommands: string[] = []
  grantSudoPermissions: boolean = true
  _files: Map<string, string> = new Map()
  _commands: Map<string, string> = new Map()
  _commandErrors: Map<string, mixed> = new Map()

  setMockFile (path: string, content: string): void {
    this._files.set(path, content)
  }

  unsetMockFile (path: string): void {
    this._files.delete(path)
  }

  setMockCommand (command: string, response: string): void {
    this._commands.set(command, response)
  }

  unsetMockCommand (command: string): void {
    this._commands.delete(command)
  }

  setMockCommandError (command: string, error: mixed): void {
    this._commandErrors.set(command, error)
  }

  fileExists (file: string): boolean {
    return this._files.has(file)
  }

  async writeFile (file: string, content: string): Promise<void> {
    this.writeFileReturnValue = content
  }

  readFile (file: string): string {
    const content = this._files.get(file)
    if (content) {
      return content
    }
    throw new Error('File not found: ' + file)
  }

  async userExec (command: string): Promise<string> {
    this.userExecCalledCommands.push(command)
    const result = this._getExecResult(command)
    return result
  }

  async sudoExec (command: string): Promise<string> {
    if (!this.grantSudoPermissions) {
      throw new Error('ACCESS_DENIED')
    }
    this.sudoExecCalledCommands.push(command)
    const result = this._getExecResult(command)
    return result
  }

  _getExecResult (command: string) {
    const error = this._commandErrors.get(command)
    if (error) {
      throw error
    }
    const result = this._commands.get(command)
    if (result) {
      return result
    }
    return 'UNKNOWN_COMMAND'
  }
}
