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

import type {System} from '../../src/libraries/mysterium-client/system'

export default class SystemMock implements System {
  writeFileReturnValue = null
  get userExecCalledTimes (): number {
    return this.userExecCalledCommands.length
  }
  userExecCalledCommands: Array<string> = []
  sudoExecCalledCommands: Array<string> = []
  files: Map<string, string>
  execs: Map<string, string>

  constructor (files: ?Map<string, string> = null, execs: ?Map<string, string> = null) {
    this.files = files || new Map()
    this.execs = execs || new Map()
  }

  fileExists (file: string): boolean {
    return this.files.has(file)
  }

  async writeFile (file: string, content: string): Promise<void> {
    this.writeFileReturnValue = content
  }

  readFile (file: string): string {
    const content = this.files.get(file)
    if (content) {
      return content
    }
    throw new Error('File not found: ' + file)
  }

  async userExec (command: string): Promise<string> {
    const result = this._getExecResult(command)
    this.userExecCalledCommands.push(command)
    return result
  }

  async sudoExec (command: string): Promise<string> {
    const result = this._getExecResult(command)
    this.sudoExecCalledCommands.push(command)
    return result
  }

  _getExecResult (command: string) {
    const result = this.execs.get(command)
    if (result) {
      return result
    }
    return 'UNKNOWN_COMMAND'
  }
}
