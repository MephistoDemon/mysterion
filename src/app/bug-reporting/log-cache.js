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
import LimitedLinkedList from '../../libraries/limited-linked-list'

type LogCaches = {
  info: LimitedLinkedList,
  error: LimitedLinkedList
}

class LogCache {
  _logs: LogCaches = {
    info: new LimitedLinkedList(300),
    error: new LimitedLinkedList(300)
  }

  pushToCache (level: 'info' | 'error', data: any) {
    this._logs[level].insert(data)
  }

  getLogCache (): {info: Array<any>, error: Array<any>} { // maybe getLogCacheForLevel
    return {
      info: this._logs.info.toArray(),
      error: this._logs.error.toArray()
    }
  }

  serializeAllLogs (): {info: string, error: string} {
    return {
      info: this._logs.info.toArray().reverse().join('\n'),
      error: this._logs.error.toArray().reverse().join('\n')
    }
  }
}

export default LogCache
