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

import type { EnvironmentCollector } from './bug-reporting/environment/environment-collector'
import type { SyncMainCommunication } from './communication/sync/sync-communication'
import LogCache from './logging/log-cache'
import logger from './logger'

/**
 * Adds sync application callbacks for communication messages.
 */
class SyncCallbacksInitializer {
  _environmentCollector: EnvironmentCollector
  _communication: SyncMainCommunication
  _frontendLogCache: LogCache

  constructor (communication: SyncMainCommunication, environmentCollector: EnvironmentCollector, frontendLogCache: LogCache) {
    this._environmentCollector = environmentCollector
    this._communication = communication
    this._frontendLogCache = frontendLogCache
  }

  initialize () {
    this._communication.onGetSerializedCaches(() => this._environmentCollector.getSerializedCaches())
    this._communication.onGetMetrics(() => this._environmentCollector.getMetrics())
    this._communication.onLog((logDto) => {
      if (!logDto) {
        logger.error('Got empty log object from communication')
      } else {
        this._frontendLogCache.pushToLevel(logDto.level, logDto.data)
      }
    })
  }
}

export default SyncCallbacksInitializer
