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

import LogCache from './log-cache'
import type { SerializedLogCache } from './log-cache'

class LogCacheBundle {
  _backendCache: LogCache
  _frontendCache: LogCache
  _mysteriumProcessCache: LogCache

  constructor (backendCache: LogCache, frontendCache: LogCache, mysteriumProcessCache: LogCache) {
    this._backendCache = backendCache
    this._frontendCache = frontendCache
    this._mysteriumProcessCache = mysteriumProcessCache
  }

  getSerialized (): SerializedLogCaches {
    return {
      backend: this._backendCache.getSerialized(),
      frontend: this._frontendCache.getSerialized(),
      mysterium_process: this._mysteriumProcessCache.getSerialized()
    }
  }
}

type SerializedLogCaches = {
  backend: SerializedLogCache,
  frontend: SerializedLogCache,
  mysterium_process: SerializedLogCache,
}

export default LogCacheBundle
export type { SerializedLogCaches }
