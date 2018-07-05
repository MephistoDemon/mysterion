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

type NodeHealthcheckDTO = {
  uptime: string,
  process: number,
  version: string,
  buildInfo: NodeBuildInfoDTO
}

/**
 * Tries to parse data into DTO type
 */
function parseHealthcheckResponse (data: mixed): NodeHealthcheckDTO {
  const errorMessage = 'Unable to parse response'
  if (typeof data !== 'object' || data === null) {
    throw new Error(errorMessage)
  }

  const uptime = data.uptime
  if (typeof uptime !== 'string') {
    throw new Error(errorMessage)
  }

  const process = data.process
  if (typeof process !== 'number') {
    throw new Error(errorMessage)
  }

  const version = data.version
  if (typeof version !== 'string') {
    throw new Error(errorMessage)
  }

  const buildInfoData = data.buildInfo
  if (typeof buildInfoData !== 'object' || buildInfoData === null) {
    throw new Error(errorMessage)
  }
  const buildInfo = new NodeBuildInfoDTO(buildInfoData)

  return { uptime, process, version, buildInfo }
}

export type { NodeHealthcheckDTO }
export { parseHealthcheckResponse }
