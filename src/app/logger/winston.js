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

import winston from 'winston'
import type { LogLevel } from './mysterion-log-levels'

type Winston = {
  level: string,
  message: string,
  timestamp?: string
}

function mapWinstonLogLevelToMysterionLevel (level: string): LogLevel {
  switch (level) {
    case 'error':
      return 'error'
    case 'info':
    case 'warn':
    case 'debug':
    default:
      return 'info'
  }
}

const winstonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(log => `${log.timestamp} ${log.level}: ${log.message}`)
)

export type { Winston }
export { winstonFormat, mapWinstonLogLevelToMysterionLevel }
