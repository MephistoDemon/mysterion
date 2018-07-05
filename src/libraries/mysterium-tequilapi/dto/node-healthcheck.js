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
import NodeBuildInfoDTO from './node-build-info'

class NodeHealthcheckDTO {
  uptime: string
  process: number
  version: string
  buildInfo: NodeBuildInfoDTO

  // TODO: DRY error throw
  // TODO: extract logic out
  constructor (data: mixed) {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Unable to parse response')
    }

    const uptime = data.uptime
    if (typeof uptime !== 'string') {
      throw new Error('Unable to parse response')
    }
    this.uptime = uptime

    const process = data.process
    if (typeof process !== 'number') {
      throw new Error('Unable to parse response')
    }
    this.process = process

    const version = data.version
    if (typeof version !== 'string') {
      throw new Error('Unable to parse response')
    }
    this.version = version

    const buildInfo = data.buildInfo
    if (typeof buildInfo !== 'object' || buildInfo === null) {
      throw new Error('Unable to parse response')
    }
    this.buildInfo = new NodeBuildInfoDTO(buildInfo)
  }
}

export default NodeHealthcheckDTO
